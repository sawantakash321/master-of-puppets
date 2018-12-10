import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { SkillEditor, NotFound } from './components/index';

const history = createBrowserHistory();

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={SkillEditor} />
      <Route exact path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default Routes;
