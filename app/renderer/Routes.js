import React from 'react';
import { Switch, Route } from 'react-router';
import CommandPalette from 'react-command-palette';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import BrowserPage from './containers/BrowserPage';
import CommandHeader from '../../shared/components/CommandHeader';
import commands from '../../shared/constants/commands';

export default () => (
  <App>
    <CommandPalette
      commands={commands}
      header={CommandHeader()}
      hotKeys="ctrl+shift+p"
      trigger={<div className="commandpalette">Command Palette</div>}
      closeOnSelect={true}
    />
    <Switch>
      <Route path={routes.HOME} component={HomePage} />
      <Route path={routes.BROWSER} component={BrowserPage} />
    </Switch>
  </App>
);
