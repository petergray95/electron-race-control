import {
  addSession,
  updateSession,
  removeSession
} from '../../shared/actions/sessions';

import { F12019SessionLive, F12019SessionHistoric } from './data/f12019';
import store from './store';

const DataSessionFactory = type =>
  ({
    f12019live: F12019SessionLive,
    f12019historic: F12019SessionHistoric
  }[type]);

class DataModel {
  constructor() {
    this.sessions = {};
  }

  getSession(sessionId) {
    return this.sessions[sessionId];
  }

  addLiveSession() {
    const SessionFactory = DataSessionFactory('f12019live');
    const session = new SessionFactory();

    this.addSession(session);
  }

  addHistoricSession(filepath) {
    const SessionFactory = DataSessionFactory('f12019historic');
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
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionId, sessionConfig));
  }

  stopRecordingSession(sessionId) {
    const session = this.getSession(sessionId);
    session.stop();
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionId, sessionConfig));
  }

  async downloadSession(sessionId) {
    const session = this.getSession(sessionId);
    session.downloadSession();
  }

  setSessionName(sessionId, name) {
    const session = this.getSession(sessionId);
    session.setName(name);
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionId, sessionConfig));
  }

  setSessionColor(sessionId, color) {
    const session = this.getSession(sessionId);
    session.setColor(color);
    const sessionConfig = session.getStoreConfig();
    store.dispatch(updateSession(sessionId, sessionConfig));
  }

  exportLaps(laps) {
    laps.forEach(lap => {
      const session = this.getSession(lap.sessionId);
      session.exportLap(lap.carId, lap.id);
    })
  }
}

const dataModel = new DataModel();

export default dataModel;
