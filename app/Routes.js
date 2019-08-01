import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import DashPage from './containers/DashPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} component={DashPage} />
    </Switch>
  </App>
);
