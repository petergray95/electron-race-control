import { v4 as uuid } from 'uuid';
import fs from 'fs';
import zlib from 'zlib';

import { updateSession } from '../../../shared/actions/sessions';
import { addLap } from '../../../shared/actions/laps';
import { addParticipant } from '../../../shared/actions/participants';
import { updateCursor } from '../../../shared/actions/cursor';
import store from '../store';


export class BaseDataSession {
  constructor() {
    this.data = {};
    this.buffer = [];
    this.name = 'Base';
    this.id = uuid();
    this.color = '#f44336';
    this.sessionType = 'base';
    this.isRunning = false;

    // Session info
    this.laps = {};
    this.participants = {};
    this.details = {};
  }

  getStoreConfig() {
    return {
      sessionId: this.id,
      name: this.name,
      sessionType: this.sessionType,
      color: this.color,
      isRunning: this.isRunning,
      details: this.details
    };
  }

  setName(name) {
    this.name = name;
  }

  setColor(color) {
    this.color = color;
  }

  getDetails() {
    console.log(this);
    throw new Error('session getDetails not implemented');
  }

  getParticipants() {
    console.log(this);
    throw new Error('session getParticipants not implemented');
  }

  getLaps() {
    console.log(this);
    throw new Error('session getLaps not implemented');
  }

  exportLap() {
    console.log(this);
    throw new Error('session exportLap not implemented');
  }

  getLap(carId, lapId) {
    return this.laps[carId][lapId];
  }

  exportLaps(laps) {
    laps.forEach(lap => {
      this.exportLap(lap);
    })
  }

  addParticipant(participant) {
    store.dispatch(addParticipant(this.id, participant.id, participant));
    this.participants[participant.carId] = participant;
  };

  addLap(carId, lapId, lap) {
    this.participants[carId].laps.push(lapId);

    store.dispatch(addLap(this.id, lapId, lap));
    this.laps[carId][lapId] = lap;
  };

  addDetails(details) {
    this.details = details;

    const storeConfig = this.getStoreConfig();
    store.dispatch(updateSession(this.id, storeConfig));
  }

  addLaps(laps) {
    Object.keys(laps).forEach(carId => {
      const carLaps = laps[carId];
      Object.keys(carLaps).forEach(lapId => {
        this.addLap(carId, lapId, carLaps[lapId]);
      })
    })
  };

  addParticipants(participants) {
    Object.keys(participants).forEach(carId => {
      const participant = participants[carId];
      this.addParticipant(participant);
    });
  }
}

export class BaseDataSessionLive extends BaseDataSession {
  constructor() {
    super();
    this.sessionType = 'live';
    this.client = null;
  }

  addMessage(message) {
    const cursor = {
      sessionId: this.id,
      values: message,
      meta: {
        timestamp: new Date().getTime(),
        numberRecords: this.data.length,
        lastRecord: message
      }
    };
    store.dispatch(updateCursor(cursor));
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

export class BaseDataSessionHistoric extends BaseDataSession {
  constructor() {
    super();
    this.name = 'Historic';
    this.sessionType = 'historic';
  }

  setData(data) {
    this.data = data;

    const participants = this.getParticipants();
    this.addParticipants(participants);

    const laps = this.getLaps();
    this.addLaps(laps);

    const details = this.getDetails();
    this.addDetails(details);
  }

  loadData(filepath) {
    fs.readFile(filepath, (fsErr, data) => {
      zlib.inflate(data, (zlibErr, result) => {
        const parsedData = JSON.parse(result);
        this.setData(parsedData);
      });
    });
  }

  downloadSession() {
    const filename = 'export.etx';
    const blob = {
      header: {
        name: this.name
      },
      data: { ...this.data }
    };

    zlib.deflate(JSON.stringify(blob), (deflateErr, buffer) => {
      if (!deflateErr) {
        fs.writeFile(filename, buffer, writeErr => {
          if (writeErr) {
            console.log(writeErr);
          }
        });
      }
    });
  }
}
