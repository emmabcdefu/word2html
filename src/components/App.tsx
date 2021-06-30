import React, { CSSProperties } from 'react';
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

let info: any = {};

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

const diplay = (value: boolean) => {
  if (value) {
    const mystyle: CSSProperties = {};
    return mystyle;
  }
  const mystyle: CSSProperties = {
    display: 'none',
  };
  return mystyle;
};

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

const App: React.FC = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const [disable, setEnable] = React.useState(false);
  const [openAlert1, setOpenAlert1] = React.useState(false);
  const [openAlert2, setOpenAlert2] = React.useState(false);
  const [pathHTML, setPath] = React.useState('');

  const handleClose1 = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      setOpenAlert1(false);
    }
  };

  const handleClose2 = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      setOpenAlert2(false);
    }
  };

  const steps = [
    'Save a copy of your word report',
    'Input your report and style',
    'Edit your report',
  ];

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
      if (err) setOpenAlert1(true);
      else setOpenAlert2(true);
    });
  };

  const saveHTML = () => {
    const html = output(info);
    const filePath = path.join(info.path, '/my_report.html');
    setPath(filePath);

    fs.writeFile(filePath, html, (err: any) => {
      if (err) setOpenAlert1(true);
      else setOpenAlert2(true);
    });
  };

  const setInfo = (res: any) => {
    info = res;
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
          <div style={diplay(activeStep !== steps.length - 1)}>
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
          <div style={diplay(activeStep === steps.length - 1)}>
            <Button variant="contained" color="primary" onClick={saveJSON}>
              Save information
            </Button>
          </div>
          <div style={diplay(activeStep === steps.length - 1)}>
            <Button variant="contained" color="primary" onClick={saveHTML}>
              Export your report
            </Button>
          </div>
          <div style={diplay(activeStep === steps.length - 1)}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                console.log(info);
              }}
            >
              console log
            </Button>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openAlert1}
          autoHideDuration={2000}
          onClose={handleClose1}
        >
          <Alert onClose={handleClose1} severity="error">
            The HTML file failed to be saved here : {pathHTML}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openAlert2}
          autoHideDuration={2000}
          onClose={handleClose2}
        >
          <Alert onClose={handleClose2} severity="success">
            The HTML file has been successfully saved here: {pathHTML}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
};

export default App;
