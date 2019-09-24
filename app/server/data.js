import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import zlib from 'zlib';
import { flatten } from 'flat';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import simplifyPoints from './simplify';
import { updateData } from '../../shared/actions/data';
import {
  addSession,
  updateSession,
  removeSession
} from '../../shared/actions/sessions';
import { addLap } from '../../shared/actions/laps';
import { updateCursor } from '../../shared/actions/cursor';
import store from './store';

const { PACKETS } = constants;

const getTimestampGroup = timestamp => Math.round(timestamp / 10000) * 10000;

const getTimestampGroupRange = (start, end) => {
  const startGroup = getTimestampGroup(start);
  const endGroup = getTimestampGroup(end);

  const timestampGroups = Array((endGroup - startGroup) / 10000 + 1).fill(null);

  return timestampGroups.map(
    (timestampGroup, index) => startGroup + index * 10000
  );
};

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

  getLaps() {
    const laps = [];

    const lapData = _.get(this.data, ['data', 'lapData'], {});

    let currentLapNum = null;
    let currentLapStart = null;

    Object.keys(lapData).forEach((timestampGroup, timestampGroupIndex) => {
      const timestamps = lapData[timestampGroup].times;
      timestamps.forEach((timestamp, timestampIndex) => {
        const timestampLapNum =
          lapData[timestampGroup]['m_lapData.0.m_currentLapNum'][
            timestampIndex
          ];

        if (!currentLapNum) {
          currentLapNum = timestampLapNum;
        }

        if (!currentLapStart) {
          currentLapStart = timestamp;
        }

        if (timestampLapNum !== currentLapNum) {
          const lap = {
            id: uuid(),
            sessionId: this.id,
            startTime: currentLapStart,
            number: currentLapNum,
            endTime: timestamps[timestampIndex - 1],
            lapTime:
              lapData[timestampGroup]['m_lapData.0.m_lastLapTime'][
                timestampIndex
              ],
            isValid: !lapData[timestampGroup][
              'm_lapData.0.m_currentLapInvalid'
            ][timestampIndex - 1],
            isFullLap: true
          };

          laps.push(lap);

          currentLapStart = timestamp;
          currentLapNum = timestampLapNum;
        }

        if (
          timestampIndex + 1 === timestamps.length &&
          timestampGroupIndex + 1 === Object.keys(lapData).length
        ) {
          const lap = {
            id: uuid(),
            sessionId: this.id,
            startTime: currentLapStart,
            number: currentLapNum,
            endTime: timestamps[timestampIndex - 1],
            lapTime: timestamps[timestampIndex - 1] - currentLapStart,
            isValid: !lapData[timestampGroup][
              'm_lapData.0.m_currentLapInvalid'
            ][timestampIndex - 1],
            isFullLap: false
          };

          laps.push(lap);
        }
      });
    });

    laps.forEach(lap => {
      store.dispatch(addLap(this.id, lap.id, lap));
    });
  }

  loadData(filepath) {
    fs.readFile(filepath, (fsErr, data) => {
      zlib.inflate(data, (zlibErr, result) => {
        const parsedData = JSON.parse(result);
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
        [messageType, `_${timestampRound}`, key],
        []
      );
      data.push(value);
      _.set(this.data, [messageType, `_${timestampRound}`, key], data);
    });

    const times = _.get(
      this.data,
      [messageType, `_${timestampRound}`, 'times'],
      []
    );
    times.push(timestamp);
    _.set(this.data, [messageType, `_${timestampRound}`, 'times'], times);

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
    store.dispatch(updateSession(sessionConfig));
  }

  stopRecordingSession(sessionId) {
    const session = this.getSession(sessionId);
    session.stop();
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionConfig));
  }

  async downloadSession(sessionId) {
    const session = this.getSession(sessionId);
    session.downloadSession();
  }

  setSessionName(sessionId, name) {
    const session = this.getSession(sessionId);
    session.setName(name);
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionConfig));
  }

  setSessionColor(sessionId, color) {
    const session = this.getSession(sessionId);
    session.setColor(color);
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionConfig));
  }

  exportLaps(laps: array) {
    const start = performance.now();

    const channels = [
      ['carTelemetry', 'm_carTelemetryData.0.m_speed'],
      ['carTelemetry', 'm_carTelemetryData.0.m_throttle'],
      ['carTelemetry', 'm_carTelemetryData.0.m_brake']
    ];

    laps.forEach(lap => {
      const session = this.getSession(lap.sessionId);

      const timeGroups = getTimestampGroupRange(lap.startTime, lap.endTime);

      const output = { session: session.getStoreConfig(), lap, data: {} };

      channels.forEach(([group, channel]) => {
        const key = `${group}.${channel}`;
        output.data[key] = [];

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
            output.data[key].push({ time, value: subValues[index] });
          });
        });

        output.data[key] = simplifyPoints(output.data[key], 0.1, true);
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
