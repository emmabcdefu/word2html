import React from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import fs from 'fs';
import path from 'path';

import './App.global.css';
import CustomStepper from './Custom/stepper';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepThree from './Steps/StepThree';
import Theme from '../theme/theme';
import output from './TextTransform/Output';
import IconStatus from './Custom/IconStatus';

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

const steps = [
  'Save a copy of your word report',
  'Output your report and style',
  'Edit your report',
];

const App: React.FC = () => {
  const classes = useStyles();

  const defaultinfo: any = { path: '', content: [], style: '' };
  const [info, setInfo] = React.useState(defaultinfo);
  const [activeStep, setActiveStep] = React.useState(0);
  const [disable, setEnable] = React.useState(false);
  const [htmlOutput, sethtmlOutput] = React.useState('');
  const [jsonOutput, setjsonOutput] = React.useState('');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const saveJSON = () => {
    const json = JSON.stringify(info);
    const filePath = path.join(info.path, '/my_report.json');

    fs.writeFile(filePath, json, (err: any) => {
      if (err) setjsonOutput('Error');
      else {
        setjsonOutput('Valide');
        setTimeout(() => {
          setjsonOutput('');
        }, 3000);
      }
    });
  };

  const saveHTML = () => {
    const html = output(info);
    const filePath = path.join(info.path, '/my_report.html');

    fs.writeFile(filePath, html, (err: any) => {
      if (err) sethtmlOutput('Error');
      else {
        sethtmlOutput('Valide');
        setTimeout(() => {
          sethtmlOutput('');
        }, 3000);
      }
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
          {activeStep === steps.length - 1 && jsonOutput !== '' ? (
            <div>
              <IconStatus status={jsonOutput} />
            </div>
          ) : null}
          {activeStep === steps.length - 1 ? (
            <div>
              <Button variant="contained" color="primary" onClick={saveHTML}>
                Export your report
              </Button>
            </div>
          ) : null}
          {activeStep === steps.length - 1 && htmlOutput !== '' ? (
            <div>
              <IconStatus status={htmlOutput} />
            </div>
          ) : null}
        </div>
      </ThemeProvider>
    </div>
  );
};

export default App;
