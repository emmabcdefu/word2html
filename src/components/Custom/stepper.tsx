import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core/StepIcon';
import SaveIcon from '@material-ui/icons/Save';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  stepper: {
    background: '#424242',
  },
  activate: {
    color: '#fff',
  },
  default: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const Connector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});

function StepIcon(props: StepIconProps) {
  const classes = useStepIconStyles();
  const { active, completed } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SaveIcon />,
    2: <DescriptionIcon />,
    3: <EditIcon />,
  };

  const { icon } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(icon)]}
    </div>
  );
}

const CustomStepper = (props: { steps: string[]; activeStep: number }) => {
  const { steps, activeStep } = props;
  const classes = useStyles();

  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      connector={<Connector />}
      className={classes.stepper}
    >
      {steps.map((label: string) => (
        <Step key={label}>
          <StepLabel StepIconComponent={StepIcon}>
            <Typography
              className={
                steps[activeStep] === label ? classes.activate : classes.default
              }
            >
              {label}
            </Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CustomStepper;
