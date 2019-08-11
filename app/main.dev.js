/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let rendererWindow = null;
let dataWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  rendererWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  dataWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  rendererWindow.loadURL(`file://${__dirname}/renderer/app.html`);
  dataWindow.loadURL(`file://${__dirname}/data/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  rendererWindow.webContents.on('did-finish-load', () => {
    if (!rendererWindow) {
      throw new Error('"rendererWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      rendererWindow.minimize();
    } else {
      rendererWindow.show();
      rendererWindow.focus();
    }
  });

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  dataWindow.webContents.on('did-finish-load', () => {
    if (!dataWindow) {
      throw new Error('"dataWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      dataWindow.minimize();
    } else {
      dataWindow.show();
    }
  });

  rendererWindow.on('closed', () => {
    rendererWindow = null;
  });

  dataWindow.on('closed', () => {
    rendererWindow = null;
  });

  const menuBuilderRenderer = new MenuBuilder(rendererWindow);
  const menuBuilderData = new MenuBuilder(dataWindow);
  menuBuilderRenderer.buildMenu();
  menuBuilderData.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
