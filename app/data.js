import { F1TelemetryClient, constants } from 'f1-telemetry-client';

const { PACKETS } = constants;

class DataSession {
  constructor() {
    this.data = [];

    this.client = new F1TelemetryClient();

    this.client.on(PACKETS.carTelemetry, message =>
      this.addData(PACKETS.carTelemetry, message)
    );
  }

  debug() {
    setInterval(() => this.addMessage(PACKETS.carTelemetry, { a: 10 }), 100);
  }

  run() {
    this.client.start();
  }

  addMessage(messageType, message) {
    this.data.push(message);
    console.log(this.data.length);
  }
}

class DataModel {
  constructor() {
    this.sessions = [];
  }

  addSession() {
    const session = new DataSession();
    this.sessions.push(session);
    return session;
  }

  removeSession(sessionId) {
    console.log('removing session', this.sessions, sessionId);
  }
}

const dataModel = new DataModel();

dataModel.addSession().debug();

export default dataModel;
