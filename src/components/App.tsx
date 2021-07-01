import React from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import fs from 'fs';
import path from 'path';

import './App.global.css';
import CustomStepper from './Custom/stepper';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepThree from './Steps/StepThree';
import Theme from '../theme/theme';
import output from './TextTransform/Output';

const useStyles: any = makeStyles(() => ({
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '& div + div': {
      marginLeft: 15,
    },
    padding: 16,
  },
  root: {
    height: '100vh',
  },
}));

const Alert = (props: AlertProps) => {
  const { onClose, severity, children } = props;
  return (
    <MuiAlert
      elevation={6}
      variant="filled"
      {...{ onClose, severity, children }}
    />
  );
};

const steps = [
  'Save a copy of your word report',
  'Input your report and style',
  'Edit your report',
];

const App: React.FC = () => {
  const classes = useStyles();

  const defaultinfo: any = { path: '', content: [], style: '' };
  const [info, setInfo] = React.useState(defaultinfo);
  const [activeStep, setActiveStep] = React.useState(0);
  const [disable, setEnable] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [pathHTML, setPath] = React.useState('');

  const handleCloseError = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      setOpenError(false);
    }
  };

  const handleCloseSuccess = (
    _event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason !== 'clickaway') {
      setOpenSuccess(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const saveJSON = () => {
    const json = JSON.stringify(info);
    const filePath = path.join(info.path, '/my_report.json');
    setPath(filePath);

    fs.writeFile(filePath, json, (err: any) => {
      if (err) setOpenError(true);
      else setOpenSuccess(true);
    });
  };

  const saveHTML = () => {
    const html = output(info.content, info.style);
    const filePath = path.join(info.path, '/my_report.html');
    setPath(filePath);

    fs.writeFile(filePath, html, (err: any) => {
      if (err) setOpenError(true);
      else setOpenSuccess(true);
    });
  };

  const step = (thisStep: number) => {
    switch (thisStep) {
      case 0:
        return <StepOne />;
      case 1:
        return (
          <StepTwo
            info={info}
            setInfo={setInfo}
            enableNext={() => setEnable(true)}
          />
        );
      default:
        return <StepThree info={info} setInfo={setInfo} />;
    }
  };

  return (
    <div className={classes.root}>
      <ThemeProvider theme={Theme}>
        <CustomStepper steps={steps} activeStep={activeStep} />

        {step(activeStep)}

        <div className={classes.flex}>
          <div>
            <Button
              variant="contained"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
          {activeStep !== steps.length - 1 ? (
            <div>
              <Button
                variant="contained"
                disabled={
                  (activeStep === 1 && !disable) ||
                  activeStep === steps.length - 1
                }
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          ) : null}
          {activeStep === steps.length - 1 ? (
            <div>
              <Button variant="contained" color="primary" onClick={saveJSON}>
                Save information
              </Button>
            </div>
          ) : null}
          {activeStep === steps.length - 1 ? (
            <div>
              <Button variant="contained" color="primary" onClick={saveHTML}>
                Export your report
              </Button>
            </div>
          ) : null}
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openError}
          autoHideDuration={2000}
          onClose={handleCloseError}
        >
          <Alert onClose={handleCloseError} severity="error">
            The HTML file failed to be saved here : {pathHTML}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSuccess}
          autoHideDuration={2000}
          onClose={handleCloseSuccess}
        >
          <Alert onClose={handleCloseSuccess} severity="success">
            The HTML file has been successfully saved here: {pathHTML}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
};

export default App;
