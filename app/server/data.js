// import { ipcMain } from 'electron-better-ipc';
import { F1TelemetryClient, constants } from 'f1-telemetry-client';
// import ipcChannels from './constants/ipc-channels';

const { PACKETS } = constants;

class DataSession {
  constructor() {
    this.data = [];
    this.debug_client = null;

    this.client = new F1TelemetryClient();

    this.client.on(PACKETS.carTelemetry, message =>
      this.addMessage(PACKETS.carTelemetry, message)
    );
  }

  debugStart() {
    if (this.debug_client) {
      this.debugStop();
    }

    this.debug_client = setInterval(
      () =>
        this.addMessage(PACKETS.carTelemetry, {
          mspeed: Math.random(),
          timestamp: new Date().getTime()
        }),
      100
    );
  }

  start() {
    this.client.start();
  }

  stop() {
    this.client.stop();
  }

  debugStop() {
    clearInterval(this.debug_client);
    this.debug_client = null;
  }

  addMessage(messageType, message) {
    this.data.push(message);
    // ipcMain.sendToRenderers(ipcChannels.DATA, message);
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

export default dataModel;
