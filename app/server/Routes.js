import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { ipcRenderer } from 'electron-better-ipc';
import { addSession } from '../../shared/actions/sessions';
import ipcConstants from '../../shared/constants/ipc-channels';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import store from './store';

export default class Routes extends Component<Props> {

  constructor(props) {
    super(props);

    this.initialiseCommands();
  }

  initialiseCommands() {
    ipcRenderer.on(ipcConstants.COMMAND, (event, message) => {
      switch (message) {
        case 'server:addlivedebugsession': {
          const config = {
            model: 'debug'
          };
          store.dispatch(addSession(config));
          break;
        }
        default: {
          break;
        }
      }
    })
  }

  render() {
    return (
      <App>
        <Switch>
          <Route path={routes.HOME} component={HomePage} />
        </Switch>
      </App>
    )
  }
};
