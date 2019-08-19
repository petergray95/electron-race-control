import { v4 as uuidv4 } from 'uuid';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import { updateData } from '../../shared/actions/data';
import store from './store';

const { PACKETS } = constants;

class BaseDataSessionLive {
  constructor() {
    this.client = null;
    this.data = [];
    this.name = 'base';
    this.id = uuidv4();

    this.isRunning = false;
  }

  start() {
    console.log(this);
    throw new Error('session start not implemented');
  }

  stop() {
    console.log(this);
    throw new Error('session stop not implemented');
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

  addMessage(messageType, message) {
    this.data.push(message);
    store.dispatch(updateData(this.id, this.data));
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

    this.client = setInterval(
      () =>
        this.addMessage(PACKETS.carTelemetry, {
          id: this.id,
          mspeed: Math.random(),
          timestamp: new Date().getTime()
        }),
      50
    );

    this.isRunning = true;
  }

  stop() {
    clearInterval(this.client);
    this.client = null;
    this.isRunning = false;
  }

  addMessage(messageType, message) {
    this.data.push(message);
    store.dispatch(updateData(this.id, this.data));
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

  getSession(id) {
    return this.sessions[id];
  }

  getStoreSessions() {
    const sessions = {};
    Object.keys(this.sessions).forEach(id => {
      const Session = this.sessions[id];
      sessions[Session.id] = { id: Session.id, name: Session.name };
    });
    return sessions;
  }

  addSession() {
    const SessionFactory = DataSessionFactory('debug');
    const Session = new SessionFactory();
    this.sessions[Session.id] = Session;
    return Session;
  }

  removeSession(id) {
    const Session = this.sessions[id];
    if (Session.isRunning) {
      Session.stop();
    }
    delete this.sessions[id];
  }
}

const dataModel = new DataModel();

export default dataModel;
