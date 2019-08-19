import { v4 as uuidv4 } from 'uuid';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
import { updateData } from '../../shared/actions/data';
import { addSession, removeSession } from '../../shared/actions/sessions';
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
    store.dispatch(updateData(this.id, this.data.slice(-50)));
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

  addSession() {
    const SessionFactory = DataSessionFactory('debug');
    const session = new SessionFactory();
    this.sessions[session.id] = session;

    const config = {
      id: session.id,
      name: session.name
    };

    store.dispatch(addSession(config));
  }

  removeSession(id) {
    const session = this.sessions[id];
    if (session.isRunning) {
      session.stop();
    }
    delete this.sessions[id];

    store.dispatch(removeSession(id));
  }
}

const dataModel = new DataModel();

export default dataModel;
