import { F1TelemetryClient, constants } from 'f1-telemetry-client';

const { PACKETS } = constants;

class BaseDataSessionLive {
  constructor() {
    this.client = null;
    this.data = [];
    this.name = 'base';
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
  }

  stop() {
    this.client.stop();
  }

  addMessage(messageType, message) {
    this.data.push(message);
  }
}

class DataSessionDebug extends BaseDataSessionLive {
  constructor(opts) {
    super(opts);
    this.name = 'debug session';
    this.client = null;
  }

  start() {
    if (this.client) {
      this.stop();
    }

    this.client = setInterval(
      () =>
        this.addMessage(PACKETS.carTelemetry, {
          mspeed: Math.random(),
          timestamp: new Date().getTime()
        }),
      100
    );
  }

  stop() {
    clearInterval(this.debug_client);
    this.debug_client = null;
  }

  addMessage(messageType, message) {
    this.data.push(message);
  }
}

const DataSessionFactory = type =>
  ({
    live: DataSessionLive,
    debug: DataSessionDebug
  }[type]);

export default DataSessionFactory;
