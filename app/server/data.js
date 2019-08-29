import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import { updateData } from '../../shared/actions/data';
import { addSession, removeSession } from '../../shared/actions/sessions';
import { updateCursor } from '../../shared/actions/cursor';
import store from './store';

const { PACKETS } = constants;

class BaseDataSession {
  constructor() {
    this.data = {};
    this.buffer = [];
    this.name = 'base';
    this.id = uuid();
    this.color = '#ff0000';
    this.sessionType = 'base';
  }
}

class DataSessionHistoric extends BaseDataSession {
  constructor(data) {
    super();
    this.data = data;
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
        lastRecord: message.timestamp
      }
    };
    store.dispatch(updateCursor(cursor));
  }

  downloadSession() {
    const filename = 'test.etx';
    const blob = {
      header: {
        name: this.name
      },
      data: { ...this.data }
    };

    console.log(this.data, JSON.stringify(blob));

    fs.writeFile(filename, JSON.stringify(blob), err => {
      if (err) throw err;
    });
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
    _.set(this.data, [messageType, `_${timestamp}`], message);
    this.buffer.push(message);
    // this.throttledUpdateStoreData();
    if (messageType === PACKETS.carTelemetry) {
      this.throttledUpdateStoreCursor(message);
    }
  }
}

class DataSessionLive extends BaseDataSessionLive {
  constructor(opts) {
    super(opts);
    this.name = 'live session';
    this.client = new F1TelemetryClient();

    // this.client.on(PACKETS.session, message => this.addMessage(PACKETS.session, message));
    // this.client.on(PACKETS.motion, message => this.addMessage(PACKETS.motion, message));
    // this.client.on(PACKETS.lapData, message => this.addMessage(PACKETS.lapData, message));
    // this.client.on(PACKETS.event, message => this.addMessage(PACKETS.event, message));
    // this.client.on(PACKETS.participants, message => this.addMessage(PACKETS.participants, message));
    // this.client.on(PACKETS.carSetups, message => this.addMessage(PACKETS.carSetups, message));
    this.client.on(PACKETS.carTelemetry, message =>
      this.addMessage(PACKETS.carTelemetry, message)
    );
    // this.client.on(PACKETS.carStatus, message => this.addMessage(PACKETS.carStatus, message));
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
    this.name = 'debug session';
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
      this.addMessage(PACKETS.carTelemetry, message);
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

    const SessionFactory = DataSessionFactory('historic');
    const session = new SessionFactory(data);

    this.addSession(session);
  }

  addSession(session) {
    this.sessions[session.id] = session;

    const config = {
      sessionId: session.id,
      name: session.name,
      sessionType: session.sessionType,
      color: session.color
    };

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
}

function loadData(filepath) {
  const rawdata = fs.readFileSync(filepath);
  return JSON.parse(rawdata);
}

const dataModel = new DataModel();

export default dataModel;
