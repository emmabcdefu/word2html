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
import { final_write } from './TextTransform/Output';

var info: any = {};

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

const App: React.FC = () => {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);
  const [disable, setEnable] = React.useState(false);

  const steps = [
    'Save a copy of your word report',
    'Input your report and style',
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

  const saveHTML: any = () => {
    const html = final_write(info.content, info.style);
    const filePath = path.join(info.path, '/my_report.html');

    fs.writeFile(filePath, html, (err: any) => {
      if (err) console.error(err);
      console.log(`JSON succesfully saved here : ${filePath}`);
    });
  };

  const setInfo: any = (res: any) => {
    info = res;
  };

  return (
    <div className={classes.root}>
      <ThemeProvider theme={Theme}>
        <CustomStepper steps={steps} activeStep={activeStep} />

        {activeStep === 0 ? <StepOne /> :
          activeStep === 1 ?
            <StepTwo
              info={info}
              setInfo={setInfo}
              enableNext={() => setEnable(true)}
            /> : activeStep === 2 ?
              <StepThree
                info={info}
                setInfo={setInfo}
              /> :
              <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
              >
                Want to do another report ?
              </Button>
        }

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
          <div>
            <Button
              variant="contained"
              disabled={((activeStep === 1 && !disable) || (activeStep === steps.length - 1))}
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
          {activeStep === steps.length - 1 &&
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={saveHTML}
              >
                Save your report
              </Button>
            </div>
          }
          {/* <div>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => { console.log(info) }}
            >
              Show data
            </Button>
          </div> */}
        </div>
      </ThemeProvider>
    </div>
  );
};

export default App;
