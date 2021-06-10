import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.global.css';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import Theme from '../theme/theme';

export default function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={StepOne} />
          <Route path="/S2" component={StepTwo} />
          <Redirect to={"/"} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
