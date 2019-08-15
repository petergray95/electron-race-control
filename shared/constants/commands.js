import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from './ipc-channels';

const commands = [{
    category: "Dash",
    name: "Dash: Add Widget",
    command() {
      ipcRenderer.send(ipcConstants.COMMAND, "dash:addwidget")
    }
  }
];

export default commands;
