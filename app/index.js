import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron-better-ipc';
import ipcChannels from './constants/ipc-channels';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import { newMessage } from './actions/dash';
import './app.global.css';

const store = configureStore();

ipcRenderer.on(ipcChannels.DATA, (event, message) =>
  store.dispatch(newMessage(message))
);

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
