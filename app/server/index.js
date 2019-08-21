import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../shared/constants/ipc-channels';
import Root from './containers/Root';
import getHistory from '../../shared/store/storeHistory';
import store from './store';
import dataModel from './data';
import './app.global.css';

const history = getHistory('renderer');

// IPC commands
ipcRenderer.on(ipcConstants.COMMAND, (event, message) => {
  switch (message.command) {
    case 'server:addsession': {
      dataModel.addSession();
      break;
    }
    case 'server:start': {
      const { sessionId } = message;
      const session = dataModel.getSession(sessionId);
      session.start();
      break;
    }
    case 'server:stop': {
      const { sessionId } = message;
      const session = dataModel.getSession(sessionId);
      session.stop();
      break;
    }
    case 'server:remove': {
      const { sessionId } = message;
      dataModel.removeSession(sessionId);
      break;
    }
    case 'server:download': {
      const { sessionId } = message;
      dataModel.downloadSession(sessionId);
      break;
    }
    default: {
      break;
    }
  }
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./containers/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
