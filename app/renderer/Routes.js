import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import CommandPalette from 'react-command-palette';
import { ipcRenderer } from 'electron-better-ipc';
import ipcConstants from '../../shared/constants/ipc-channels';
import CommandHeader from '../../shared/components/commandHeader';
import commands from '../../shared/constants/commands';
import getHistory from '../../shared/store/storeHistory';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import BrowserPage from './containers/BrowserPage';

const history = getHistory('renderer');

export default class Routes extends Component<Props> {

  constructor(props) {
    super(props);

    this.initialiseCommands();
  }

  initialiseCommands() {
    ipcRenderer.on(ipcConstants.COMMAND, (event, message) => {
      switch (message) {
        case "navigation:browser": {
          history.push(routes.BROWSER);
          break;
        }
        case "navigation:dash": {
          history.push(routes.HOME);
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  render() {
    return (
      <App>
        <CommandPalette
          commands={commands}
          header={CommandHeader()}
          hotKeys="ctrl+shift+p"
          trigger={<div className="commandpalette">Command Palette</div>}
          closeOnSelect
        />
        <Switch>
          <Route path={routes.BROWSER} component={BrowserPage} />
          <Route path={routes.HOME} component={HomePage} />
        </Switch>
      </App>
    )
  }
};
