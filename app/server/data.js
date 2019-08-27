import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import { updateData } from '../../shared/actions/data';
import { addSession, removeSession } from '../../shared/actions/sessions';
import { updateCursor } from '../../shared/actions/cursor';
import store from './store';

const { PACKETS } = constants;

class BaseDataSessionLive {
  constructor() {
    this.client = null;
    this.data = [];
    this.buffer = [];
    this.name = 'base';
    this.id = uuid();
    this.color = '#ff0000';
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
      data: this.data
    };

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
    this.data.push(message);
    this.buffer.push(message);
    // this.throttledUpdateStoreData();
    this.throttledUpdateStoreCursor(message);
  }
}

class DataSessionLive extends BaseDataSessionLive {
  constructor(opts) {
    super(opts);
    this.name = 'live session';
    this.client = new F1TelemetryClient();

    this.client.on(PACKETS.carTelemetry, message =>
      this.addMessage(PACKETS.carTelemetry, message)
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
    debug: DataSessionDebug
  }[type]);

class DataModel {
  constructor() {
    this.sessions = {};
  }

  getSession(sessionId) {
    return this.sessions[sessionId];
  }

  addSession() {
    const SessionFactory = DataSessionFactory('live');
    const session = new SessionFactory();
    this.sessions[session.id] = session;

    const config = {
      sessionId: session.id,
      name: session.name,
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

  async downloadSession(sessionId) {
    const session = this.getSession(sessionId);
    session.downloadSession();
  }
}

const dataModel = new DataModel();

export default dataModel;
