import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from './ipc-channels';

const commands = [
  {
    category: 'Dash',
    name: 'Dash: Add Widget',
    command() {
      ipcRenderer.send(ipcConstants.COMMAND, { command: 'dash:addwidget' });
    }
  },
  {
    category: 'Navigation',
    name: 'Navigation: Browser',
    command() {
      ipcRenderer.send(ipcConstants.COMMAND, { command: 'navigation:browser' });
    }
  },
  {
    category: 'Navigation',
    name: 'Navigation: Dash',
    command() {
      ipcRenderer.send(ipcConstants.COMMAND, { command: 'navigation:dash' });
    }
  },
  {
    category: 'Server',
    name: 'Server: Add Live (Debug) Session',
    command() {
      ipcRenderer.send(ipcConstants.COMMAND, {
        command: 'server:addsession',
        server_type: 'debug'
      });
    }
  }
];

export default commands;
