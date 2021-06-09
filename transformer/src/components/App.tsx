import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.global.css';
import StepOne from './StepOne/StepOne';
import Theme from '../theme/theme';

export default function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Router>
        <Switch>
          <Route path="/" component={StepOne} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
