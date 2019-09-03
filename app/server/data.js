import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import zlib from 'zlib';
// import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import F1Client from './client/telemetry';
import { updateData } from '../../shared/actions/data';
import {
  addSession,
  updateSession,
  removeSession
} from '../../shared/actions/sessions';
import { updateCursor } from '../../shared/actions/cursor';
import store from './store';

// const { PACKETS } = constants;

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

  downloadSession() {
    const filename = 'test_buffer.etx';
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
  constructor(data) {
    super();
    this.name = 'Historic';
    this.sessionType = 'historic';
    this.data = data;
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
    const timestamp = new Date().getTime();

    this.throttledUpdateStoreCursor(timestamp);
    // console.log(message);
    //
    // this.data[messageType].push(message);

    _.set(this.data, [messageType, `_${timestamp}`], message);
    // this.throttledUpdateStoreData();
    // this.throttledUpdateStoreCursor(message);
    // if (messageType === PACKETS.carTelemetry) {
    // }
  }
}

class DataSessionLive extends BaseDataSessionLive {
  constructor(opts) {
    super(opts);
    this.name = 'Live';
    this.client = new F1Client(20777);
    this.client.on('DATA', message => this.addMessage('DATA', message));
    // this.client = new F1TelemetryClient();
    //
    // this.client.on(PACKETS.session, message =>
    //   this.addMessage(PACKETS.session, message)
    // );
    // this.client.on(PACKETS.motion, message =>
    //   this.addMessage(PACKETS.motion, message)
    // );
    // this.client.on(PACKETS.lapData, message =>
    //   this.addMessage(PACKETS.lapData, message)
    // );
    // this.client.on(PACKETS.event, message =>
    //   this.addMessage(PACKETS.event, message)
    // );
    // this.client.on(PACKETS.participants, message =>
    //   this.addMessage(PACKETS.participants, message)
    // );
    // this.client.on(PACKETS.carSetups, message =>
    //   this.addMessage(PACKETS.carSetups, message)
    // );
    // this.client.on(PACKETS.carTelemetry, message =>
    //   this.addMessage(PACKETS.carTelemetry, message)
    // );
    // this.client.on(PACKETS.carStatus, message =>
    //   this.addMessage(PACKETS.carStatus, message)
    // );
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

class DataSessionDebug extends BaseDataSessionLive {
  constructor(opts) {
    super(opts);
    this.name = 'Debug';
    this.client = null;
  }

  start() {
    if (this.isRunning) {
      this.stop();
    }

    this.client = setInterval(() => {
      const message = {
        sessionId: this.id,
        timestamp: new Date().getTime()
      };
      Array.from(Array(250).keys()).forEach(i => {
        const key = `${i}`;
        message[key] = Math.random();
      });
      // this.addMessage(PACKETS.carTelemetry, message);
    }, 20);

    this.isRunning = true;
  }

  stop() {
    clearInterval(this.client);
    this.client = null;
    this.isRunning = false;
  }
}

const DataSessionFactory = type =>
  ({
    live: DataSessionLive,
    debug: DataSessionDebug,
    historic: DataSessionHistoric
  }[type]);

class DataModel {
  constructor() {
    this.sessions = {};
  }

  getSession(sessionId) {
    return this.sessions[sessionId];
  }

  addLiveSession(debug = false) {
    const sessionType = debug ? 'debug' : 'live';
    const SessionFactory = DataSessionFactory(sessionType);
    const session = new SessionFactory();

    this.addSession(session);
  }

  addHistoricSession(filepath) {
    const data = loadData(filepath);
    console.log(data);

    const SessionFactory = DataSessionFactory('historic');
    const session = new SessionFactory(data);

    this.addSession(session);
  }

  addSession(session) {
    this.sessions[session.id] = session;

    const config = session.getStoreConfig();

    store.dispatch(addSession(config));
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
    const config = session.getStoreConfig();
    store.dispatch(updateSession(config));
  }

  setSessionColor(sessionId, color) {
    const session = this.getSession(sessionId);
    session.setColor(color);
    const config = session.getStoreConfig();
    store.dispatch(updateSession(config));
  }
}

function loadData(filepath) {
  const input = fs.readFileSync(filepath);

  const rawData = zlib.inflateSync(input);

  return JSON.parse(rawData);
}

const dataModel = new DataModel();

export default dataModel;
