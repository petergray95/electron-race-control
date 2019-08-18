import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron-better-ipc';
import Root from './containers/Root';
import routes from './constants/routes';
import ipcConstants from '../../shared/constants/ipc-channels';
import getHistory from '../../shared/store/storeHistory';
import store from './store';
import './app.global.css';

const history = getHistory('renderer');

ipcRenderer.on(ipcConstants.COMMAND, (event, message) => {
  switch (message) {
    case 'navigation:browser': {
      history.push(routes.BROWSER);
      break;
    }
    case 'navigation:dash': {
      history.push(routes.HOME);
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
