import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import zlib from 'zlib';
import { flatten } from 'flat';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import {
  getTimestampGroup,
  getTimestampGroupRange,
  getClosestIndexes,
  getClosestValue,
  getSimplifiedPoints
} from './data/helpers';
import { updateData } from '../../shared/actions/data';
import {
  addSession,
  updateSession,
  removeSession
} from '../../shared/actions/sessions';
import { addLap } from '../../shared/actions/laps';
import { updateCursor } from '../../shared/actions/cursor';
import store from './store';

const { DRIVERS, PACKETS, TEAMS, TRACKS, WEATHER } = constants;

class BaseDataSession {
  constructor() {
    this.data = {};
    this.buffer = [];
    this.name = 'Base';
    this.id = uuid();
    this.color = '#f44336';
    this.sessionType = 'base';
    this.isRunning = false;
  }

  getStoreConfig() {
    return {
      sessionId: this.id,
      name: this.name,
      sessionType: this.sessionType,
      color: this.color,
      isRunning: this.isRunning
    };
  }

  setName(name) {
    this.name = name;
  }

  setColor(color) {
    this.color = color;
  }

  setData(data) {
    this.data = data;
    this.getLaps();
  }

  getLapInfo(data, carIndex, indexes, startTime, endTime) {
    return {
      id: uuid(),
      sessionId: this.id,
      carId: carIndex,
      startTime,
      endTime,
      number: getClosestValue(
        data,
        indexes.lapData.timestampGroup,
        indexes.lapData.index,
        'lapData',
        `m_lapData.${carIndex}.m_currentLapNum`
      ),
      calculatedLapTime: null,
      lapTime: null,
      isFullLap: null,
      sector1Time: getClosestValue(
        data,
        indexes.lapData.timestampGroup,
        indexes.lapData.index,
        'lapData',
        `m_lapData.${carIndex}.m_sector1Time`
      ),
      sector2Time: getClosestValue(
        data,
        indexes.lapData.timestampGroup,
        indexes.lapData.index,
        'lapData',
        `m_lapData.${carIndex}.m_sector2Time`
      ),
      isValid: !getClosestValue(
        data,
        indexes.lapData.timestampGroup,
        indexes.lapData.index,
        'lapData',
        `m_lapData.${carIndex}.m_currentLapInvalid`
      ),
      name: getClosestValue(
        data,
        indexes.participants.timestampGroup,
        indexes.participants.index,
        'participants',
        `m_participants.${carIndex}.m_name`
      ),
      team:
        TEAMS[
          getClosestValue(
            data,
            indexes.participants.timestampGroup,
            indexes.participants.index,
            'participants',
            `m_participants.${carIndex}.m_teamId`
          )
        ].name,
      driver:
        DRIVERS[
          getClosestValue(
            data,
            indexes.participants.timestampGroup,
            indexes.participants.index,
            'participants',
            `m_participants.${carIndex}.m_driverId`
          )
        ],
      circuit:
        TRACKS[
          getClosestValue(
            data,
            indexes.session.timestampGroup,
            indexes.session.index,
            'session',
            'm_trackId'
          )
        ].name,
      weather:
        WEATHER[
          getClosestValue(
            data,
            indexes.session.timestampGroup,
            indexes.session.index,
            'session',
            'm_weather'
          )
        ]
    };
  }

  getLaps() {
    const laps = Array(20)
      .fill(null)
      .reduce(
        (o, key, index) => ({
          ...o,
          [index]: { cursor: { lapNumber: null, startTime: null }, laps: [] }
        }),
        {}
      );

    const data = _.get(this.data, ['data'], {});
    const lapData = _.get(data, ['lapData'], {});

    Object.keys(lapData).forEach((timestampGroup, timestampGroupIndex) => {
      const timestamps = lapData[timestampGroup].times;
      timestamps.forEach((timestamp, timestampIndex) => {
        const currentIndexes = getClosestIndexes(data, timestamp);
        Object.keys(laps).forEach(carIndex => {
          const car = laps[carIndex];

          const lapNumber = getClosestValue(
            data,
            currentIndexes.lapData.timestampGroup,
            currentIndexes.lapData.index,
            'lapData',
            `m_lapData.${carIndex}.m_currentLapNum`
          );

          if (!car.cursor.startTime) {
            car.cursor.startTime = timestamp;
          }

          if (!car.cursor.lapNumber) {
            car.cursor.lapNumber = lapNumber;
          }

          if (car.cursor.lapNumber !== lapNumber) {
            // We have just completed a lap
            const lapCompleteTimestamp = timestamps[timestampIndex - 1];
            const previousIndexes = getClosestIndexes(
              data,
              lapCompleteTimestamp
            );

            let lap = this.getLapInfo(
              data,
              carIndex,
              previousIndexes,
              car.cursor.startTime,
              lapCompleteTimestamp
            );

            lap = {
              ...lap,
              isFullLap: true,
              calculatedLapTime: lapCompleteTimestamp - car.cursor.startTime,
              lapTime: getClosestValue(
                data,
                currentIndexes.lapData.timestampGroup,
                currentIndexes.lapData.index,
                'lapData',
                `m_lapData.${carIndex}.m_lastLapTime`
              )
            };

            car.laps.push(lap);
            store.dispatch(addLap(this.id, lap.id, lap));

            car.cursor.lapNumber = lapNumber;
            car.cursor.startTime = timestamp;
          }

          if (
            timestampGroupIndex + 1 === Object.keys(lapData).length &&
            timestampIndex + 1 === timestamps.length &&
            lapNumber !== 0
          ) {
            let lap = this.getLapInfo(
              data,
              carIndex,
              currentIndexes,
              car.cursor.startTime,
              timestamp
            );

            lap = {
              ...lap,
              isFullLap: false,
              calculatedLapTime: timestamp - car.cursor.startTime,
              sector1Time: lap.sector1Time !== 0 ? lap.sector1Time : null,
              sector2Time: lap.sector2Time !== 0 ? lap.sector2Time : null,
              sector3Time: lap.sector3Time !== 0 ? lap.sector3Time : null
            };

            car.laps.push(lap);
            store.dispatch(addLap(this.id, lap.id, lap));
          }
        });
      });
    });
    console.log(laps);
  }

  loadData(filepath) {
    fs.readFile(filepath, (fsErr, data) => {
      zlib.inflate(data, (zlibErr, result) => {
        const parsedData = JSON.parse(result);
        console.log(parsedData);
        this.setData(parsedData);
      });
    });
  }

  downloadSession() {
    const filename = 'export.etx';
    const blob = {
      header: {
        name: this.name
      },
      data: { ...this.data }
    };

    zlib.deflate(JSON.stringify(blob), (deflateErr, buffer) => {
      if (!deflateErr) {
        fs.writeFile(filename, buffer, writeErr => {
          if (writeErr) {
            console.log(writeErr);
          }
        });
      }
    });
  }
}

class DataSessionHistoric extends BaseDataSession {
  constructor() {
    super();
    this.name = 'Historic';
    this.sessionType = 'historic';
  }
}

class BaseDataSessionLive extends BaseDataSession {
  constructor() {
    super();
    this.sessionType = 'live';
    this.client = null;
    this.throttledUpdateStoreData = _.throttle(this.updateStoreData, 200);
    this.throttledUpdateStoreCursor = _.throttle(this.updateStoreCursor, 50);
  }

  updateStoreData() {
    const messages = {};

    this.buffer.forEach(dataPoint => {
      const message = {
        sessionId: this.id,
        timestamp: dataPoint.timestamp,
        values: dataPoint
      };

      messages[message.timestamp] = message;
    });

    store.dispatch(updateData(this.id, messages));
    this.buffer = [];
  }

  updateStoreCursor(message) {
    const cursor = {
      sessionId: this.id,
      values: message,
      meta: {
        timestamp: new Date().getTime(),
        numberRecords: this.data.length,
        lastRecord: message
      }
    };
    store.dispatch(updateCursor(cursor));
  }

  start() {
    console.log(this);
    throw new Error('session start not implemented');
  }

  stop() {
    console.log(this);
    throw new Error('session stop not implemented');
  }

  addMessage(messageType, message) {
    const start = performance.now();

    const timestamp = new Date().getTime();
    const timestampRound = getTimestampGroup(timestamp);

    const messageFlat = flatten(message);

    Object.entries(messageFlat).forEach(([key, value]) => {
      const data = _.get(
        this.data,
        [messageType, key, `_${timestampRound}`],
        []
      );
      data.push(value);
      _.set(this.data, [messageType, key, `_${timestampRound}`], data);
    });

    const times = _.get(
      this.data,
      [messageType, 'times', `_${timestampRound}`],
      []
    );
    times.push(timestamp);
    _.set(this.data, [messageType, 'times', `_${timestampRound}`], times);

    const duration = performance.now() - start;

    this.throttledUpdateStoreCursor(duration.toFixed(2));
  }
}

class DataSessionLive extends BaseDataSessionLive {
  constructor(opts) {
    super(opts);
    this.name = 'Live';
    this.client = new F1TelemetryClient();

    this.client.on(PACKETS.session, message =>
      this.addMessage(PACKETS.session, message)
    );
    this.client.on(PACKETS.motion, message =>
      this.addMessage(PACKETS.motion, message)
    );
    this.client.on(PACKETS.lapData, message =>
      this.addMessage(PACKETS.lapData, message)
    );
    this.client.on(PACKETS.event, message =>
      this.addMessage(PACKETS.event, message)
    );
    this.client.on(PACKETS.participants, message =>
      this.addMessage(PACKETS.participants, message)
    );
    this.client.on(PACKETS.carSetups, message =>
      this.addMessage(PACKETS.carSetups, message)
    );
    this.client.on(PACKETS.carTelemetry, message =>
      this.addMessage(PACKETS.carTelemetry, message)
    );
    this.client.on(PACKETS.carStatus, message =>
      this.addMessage(PACKETS.carStatus, message)
    );
  }

  start() {
    this.client.start();
    this.isRunning = true;
  }

  stop() {
    this.client.stop();
    this.isRunning = false;
  }
}

const DataSessionFactory = type =>
  ({
    live: DataSessionLive,
    historic: DataSessionHistoric
  }[type]);

class DataModel {
  constructor() {
    this.sessions = {};
  }

  getSession(sessionId) {
    return this.sessions[sessionId];
  }

  addLiveSession() {
    const SessionFactory = DataSessionFactory('live');
    const session = new SessionFactory();

    this.addSession(session);
  }

  addHistoricSession(filepath) {
    const SessionFactory = DataSessionFactory('historic');
    const session = new SessionFactory();
    session.loadData(filepath);

    this.addSession(session);
  }

  addSession(session) {
    this.sessions[session.id] = session;

    const sessionConfig = session.getStoreConfig();

    store.dispatch(addSession(session.id, sessionConfig));
  }

  removeSession(sessionId) {
    const session = this.getSession(sessionId);
    if (session.isRunning) {
      session.stop();
    }
    delete this.sessions[sessionId];

    store.dispatch(removeSession(sessionId));
  }

  startRecordingSession(sessionId) {
    const session = this.getSession(sessionId);
    session.start();
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionId, sessionConfig));
  }

  stopRecordingSession(sessionId) {
    const session = this.getSession(sessionId);
    session.stop();
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionId, sessionConfig));
  }

  async downloadSession(sessionId) {
    const session = this.getSession(sessionId);
    session.downloadSession();
  }

  setSessionName(sessionId, name) {
    const session = this.getSession(sessionId);
    session.setName(name);
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionId, sessionConfig));
  }

  setSessionColor(sessionId, color) {
    const session = this.getSession(sessionId);
    session.setColor(color);
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionId, sessionConfig));
  }

  exportLaps(laps: array, simplify: boolean = true) {
    const start = performance.now();

    const channels = [
      ['carTelemetry', 'm_carTelemetryData.0.m_speed'],
      ['carTelemetry', 'm_carTelemetryData.0.m_throttle'],
      ['carTelemetry', 'm_carTelemetryData.0.m_brake']
    ];

    laps.forEach(lap => {
      const session = this.getSession(lap.sessionId);

      const timeGroups = getTimestampGroupRange(lap.startTime, lap.endTime);

      const output = {
        session: session.getStoreConfig(),
        lap,
        data: {}
      };

      channels.forEach(([group, channel]) => {
        const key = `${group}.${channel}`;
        const dataArray = [];

        timeGroups.forEach((timeGroup, groupIndex) => {
          const groupData = _.get(
            session.data,
            ['data', group, `_${timeGroup}`],
            {}
          );

          let subTimes = [];
          let subValues = [];

          switch (groupIndex) {
            case 0: {
              const firstIndex = groupData.times.findIndex(
                time => time >= lap.startTime
              );
              subTimes = groupData.times.slice(firstIndex);
              subValues = groupData[channel].slice(firstIndex);
              break;
            }
            case groupData.length - 1: {
              const lastIndex = groupData.times.findIndex(
                time => time >= lap.endTime
              );
              subTimes = groupData.times.slice(0, lastIndex);
              subValues = groupData[channel].slice(0, lastIndex);
              break;
            }
            default: {
              subTimes = groupData.times;
              subValues = groupData[channel];
              break;
            }
          }
          subTimes.forEach((time, index) => {
            dataArray.push({ time, value: subValues[index] });
          });
        });

        output.data[key] = simplify
          ? getSimplifiedPoints(dataArray)
          : dataArray;
      });

      fs.writeFile(
        `./DATA/${session.name}_${lap.number}.json`,
        JSON.stringify(output),
        'utf8',
        () => {}
      );
    });

    const duration = performance.now() - start;
    console.log('exporting laps: ', duration);
  }
}

const dataModel = new DataModel();

export default dataModel;
