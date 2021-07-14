import React from 'react';
// Mui Components
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
// Style and theme
import './App.global.css';
import Theme from '../theme/theme';
// Components
import CustomStepper from './Custom/stepper';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepThree from './Steps/StepThree';
import Footer from './Custom/footer';
// Types
import Info from '../Interface/info';

const useStyles = makeStyles(() => ({
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

  const defaultinfo: Info = {
    path: '',
    content: [],
    style: '',
    navbar: true,
    imagesClickable: true,
  };
  const [info, setInfo] = React.useState(defaultinfo);
  const [activeStep, setActiveStep] = React.useState(0);
  const [disable, setEnable] = React.useState(false);

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

        <Footer
          info={info}
          setInfo={setInfo}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          disable={disable}
        />
      </ThemeProvider>
    </div>
  );
};

export default App;
