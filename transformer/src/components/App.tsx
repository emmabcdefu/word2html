import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.global.css';
import Menu from './menu/Menu';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Menu} />
      </Switch>
    </Router>
  );
}
