import React from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import './App.global.css';
import CustomStepper from './Stepper/stepper';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepThree from './Steps/StepThree';
import Theme from '../theme/theme';
import write from './TextTransform/Output';

var info: any = {};

const useStyles: any = makeStyles(() => ({
  flex: {
    display: 'flex',
    'flex-direction': 'row',
    'justify-content': 'center',
    '& div + div': {
      'margin-left': '15px',
    },
  },
}));

const App: React.FC = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [
    'Save a copy of your word report',
    'Select the htm file of your report',
    'Edit your report',
  ];

  const handleNext: any = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack: any = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset: any = () => {
    setActiveStep(0);
  };

  const setInfo: any = (res: any) => {
    info = res;
  }

  return (
    <ThemeProvider theme={Theme}>
      <CustomStepper steps={steps} activeStep={activeStep} />
      {activeStep === steps.length ? (
        <div>
          All steps completed - you&apos;re finished
          <Button variant="contained" color="primary" onClick={handleReset}>
            Want to do another report ?
          </Button>
        </div>
      ) : (
        <div>

          {activeStep === 0 ? <StepOne /> :
            activeStep === 1 ?
              <StepTwo
                setInfo={setInfo}
                handleNext={handleNext}
              /> :
              <StepThree
                info={info}
                setInfo={setInfo}
              />}

          <div className={classes.flex}>
            <div>
              <Button variant="contained" disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
            </div>
            <div>
              <Button variant="contained" disabled={activeStep === 1} color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Save your report' : 'Next'}
              </Button>
            </div>
            <div>
              <Button variant="contained" color="secondary" onClick={() => { console.log(info) }}>
                Show data
              </Button>
            </div>
            <div>
              <Button variant="contained" color="secondary" onClick={() => { if (Object.prototype.hasOwnProperty.call(info, `title`)) { console.log(write(info)) } }}>
                Show html
              </Button>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};

export default App;
