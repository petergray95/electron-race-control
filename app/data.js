import { F1TelemetryClient, constants } from 'f1-telemetry-client';

const { PACKETS } = constants;

class DataSession {
  constructor() {
    this.client = new F1TelemetryClient();

    this.client.on(PACKETS.carTelemetry, console.log);
  }

  run() {
    this.client.start();
  }
}

export default class DataModel {
  constructor() {
    this.sessions = [];
  }

  addSession() {
    const session = new DataSession();
    this.sessions.push(session);
  }

  removeSession(sessionId) {
    console.log('removing session', this.sessions, sessionId);
  }
}
