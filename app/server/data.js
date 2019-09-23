import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import zlib from 'zlib';
import { flatten } from 'flat';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
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

const createDataPoint = (data, channels, index) => {
  const dataPoint = {};
  channels.forEach(channel => {
    dataPoint[channel] = data[channel][index];
  });
  return dataPoint;
};

class BaseDataSession {
  constructor() {
    this.data = {};
    this.buffer = [];
    this.name = 'Base';
    this.id = uuid();
    this.color = '#f44336';
    this.sessionType = 'base';
  }

  getStoreConfig() {
    return {
      sessionId: this.id,
      name: this.name,
      sessionType: this.sessionType,
      color: this.color
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
    const start = performance.now();

    const laps = [];

    const lapData = _.get(this.data, ['data', 'lapData'], {});
    console.log(lapData);

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
    const duration = performance.now() - start;
    console.log('retrieving lap information: ', duration, laps);

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
    this.isRunning = false;
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
  }

  stopRecordingSession(sessionId) {
    const session = this.getSession(sessionId);
    session.stop();
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
    const channels = ['times', 'm_carTelemetryData.0.m_speed'];

    laps.forEach(lap => {
      const session = this.getSession(lap.sessionId);

      const timestampGroups = getTimestampGroupRange(
        lap.startTime,
        lap.endTime
      );

      const output = [];

      timestampGroups.forEach((timestampGroup, groupIndex) => {
        const timestampGroupData = _.get(
          session.data,
          ['data', 'carTelemetry', `_${timestampGroup}`],
          {}
        );

        switch (groupIndex) {
          case 0: {
            const firstIndex = timestampGroupData.times.findIndex(
              time => time >= lap.startTime
            );
            const subTimes = timestampGroupData.times.slice(firstIndex);

            subTimes.forEach((time, index) => {
              const offsetIndex = firstIndex + index;
              output.push(
                createDataPoint(timestampGroupData, channels, offsetIndex)
              );
            });

            break;
          }
          case timestampGroups.length - 1: {
            const lastIndex = timestampGroupData.times.findIndex(
              time => time >= lap.endTime
            );
            const subTimes = timestampGroupData.times.slice(0, lastIndex);

            subTimes.forEach((time, index) => {
              output.push(createDataPoint(timestampGroupData, channels, index));
            });
            break;
          }
          default: {
            timestampGroupData.times.forEach((time, index) => {
              output.push(createDataPoint(timestampGroupData, channels, index));
            });
            break;
          }
        }
      });

      fs.writeFile(
        `./DATA/${session.name}_${lap.number}.json`,
        JSON.stringify(output),
        'utf8',
        () => {}
      );
    });
  }
}

const dataModel = new DataModel();

export default dataModel;
