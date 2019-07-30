import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron-better-ipc';
import ipcChannels from './constants/ipc-channels';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import { increment } from './actions/counter';
import './app.global.css';

const store = configureStore();

ipcRenderer.on(ipcChannels.DATA, () => store.dispatch(increment()));

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
