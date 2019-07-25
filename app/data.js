class DataSession {
  constructor() {
    this.client = null;
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
}
