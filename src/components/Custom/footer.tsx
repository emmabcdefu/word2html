import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import fs from 'fs';
import path from 'path';
import Button from '@material-ui/core/Button';
import IconStatus from './IconStatus';

import output from '../TextTransform/Output';

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

interface ChildProps {
  info: any;
  setInfo: (info: any) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  disable: boolean;
}

const Footer: React.FC<ChildProps> = (props) => {
  const classes = useStyles();

  const { activeStep, disable } = props;

  const [htmlOutput, sethtmlOutput] = React.useState('');
  const [jsonOutput, setjsonOutput] = React.useState('');

  const handleNext = () => {
    props.setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    props.setActiveStep(activeStep - 1);
  };

  const saveJSON = () => {
    const json = JSON.stringify(props.info);
    const filePath = path.join(props.info.path, '/my_report.json');

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
    const html = output(props.info);
    const filePath = path.join(props.info.path, '/my_report.html');

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

  return (
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
      {activeStep !== 2 ? (
        <div>
          <Button
            variant="contained"
            disabled={activeStep === 1 && !disable}
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      ) : null}
      {activeStep === 2 ? (
        <div>
          <Button variant="contained" color="primary" onClick={saveJSON}>
            Save information
          </Button>
        </div>
      ) : null}
      {activeStep === 2 && jsonOutput !== '' ? (
        <div>
          <IconStatus status={jsonOutput} />
        </div>
      ) : null}
      {activeStep === 2 ? (
        <div>
          <Button variant="contained" color="primary" onClick={saveHTML}>
            Export your report
          </Button>
        </div>
      ) : null}
      {activeStep === 2 && htmlOutput !== '' ? (
        <div>
          <IconStatus status={htmlOutput} />
        </div>
      ) : null}
    </div>
  );
};

export default Footer;
