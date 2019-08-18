import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron-better-ipc';
import { updateSessions } from '../../shared/actions/sessions';
import ipcConstants from '../../shared/constants/ipc-channels';
import Root from './containers/Root';
import getHistory from '../../shared/store/storeHistory';
import store from './store';
import dataModel from './data';
import './app.global.css';

const history = getHistory('renderer');

// IPC commands
ipcRenderer.on(ipcConstants.COMMAND, (event, message) => {
  switch (message[0]) {
    case 'server:addsession': {
      dataModel.addSession();
      store.dispatch(updateSessions(dataModel.getStoreSessions()));
      break;
    }
    case 'server:start': {
      const id = message[1];
      const Session = dataModel.getSession(id);
      Session.start();
      break;
    }
    case 'server:stop': {
      const id = message[1];
      const Session = dataModel.getSession(id);
      Session.stop();
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
