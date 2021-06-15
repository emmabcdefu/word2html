import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import './App.global.css';
import CustomStepper from './Stepper/stepper';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import Theme from '../theme/theme';

export default function App() {

  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Save a copy of your word report', 'Select the htm file of your report', 'Edit your report'];

  let info: any = {};

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleChangeInfo = (res: any) => {
    info = res;
  }

  return (
    <ThemeProvider theme={Theme}>

      <CustomStepper steps={steps} activeStep={activeStep}/>

      <div>
        {activeStep === steps.length ? (
          <div>
            
            All steps completed - you&apos;re finished
            
            <Button variant="contained" color="primary" onClick={handleReset}>
              Want to do another report ?
            </Button>
          </div>
        ) : (
        <div>

          {activeStep === 0? <StepOne/>:
          <StepTwo
            handleChangeInfo={handleChangeInfo}
          />}

          <div>
            <Button variant="contained" disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" disabled={activeStep === 1} color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Save your report' : 'Next'}
            </Button>
          </div>

        </div>)}
          <Button variant="contained" color="secondary" onClick={() => {console.log(info)}}>
            Show data
          </Button>
      </div>
    </ThemeProvider>
  );
}
