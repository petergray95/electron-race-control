import * as dgram from 'dgram';
import * as fs from 'fs';
import * as zlib from 'zlib';
import EventEmitter from 'events';

export default class F1Client extends EventEmitter {
  constructor(port) {
    super();
    this.data = [];
    this.gzip = zlib.createGzip();
    this.file = fs.createWriteStream('data.gz');

    this.gzip.pipe(this.file);

    this.port = port;
    this.server = dgram.createSocket('udp4');
  }

  start() {
    if (!this.server) {
      return;
    }

    this.server.on('listening', () => {
      if (!this.server) {
        return;
      }

      this.server.setBroadcast(true);
    });
    this.server.on('message', m => this.parseMessage(m));
    this.server.bind(this.port);

    console.log('client started');
  }

  stop() {
    if (!this.server) {
      return;
    }

    this.server.close(() => {
      this.server = undefined;
      this.gzip.end();
      console.log('closed connection');
    });

    console.log('client stopped');
  }

  parseMessage(message) {
    this.data.push(message);
    this.gzip.write(message.toJSON());
    this.emit('DATA', message);
  }
}
