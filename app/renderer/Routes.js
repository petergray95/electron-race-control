import React from 'react';
import { Switch, Route } from 'react-router';
import CommandPalette from 'react-command-palette';
import CommandHeader from '../../shared/components/commandHeader';
import commands from '../../shared/constants/commands';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import BrowserPage from './containers/BrowserPage';

export default () => (
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
);
