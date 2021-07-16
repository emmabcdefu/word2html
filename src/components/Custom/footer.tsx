import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import fs from 'fs';
import path from 'path';
// Mui Components
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
// Mui-Icons
import IconStatus from './IconStatus';
// Functions
import output from '../TextTransform/Output';
// Types
import Info from '../../types/Info';

const useStyles = makeStyles(() => ({
  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    '& div': {
      marginRight: 15,
    },
    padding: 16,
  },
  root: {
    height: '100vh',
  },
}));

interface ChildProps {
  info: Info;
  setInfo: (info: Info) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
  disable: boolean;
}

const Footer: React.FC<ChildProps> = (props: ChildProps) => {
  const classes = useStyles();

  const { activeStep, disable } = props;
  const [nav, setnav] = React.useState(true);
  const [img, setimg] = React.useState(true);

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

    fs.writeFile(filePath, json, (err) => {
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

    fs.writeFile(filePath, html, (err) => {
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
      {activeStep === 2 ? (
        <FormControlLabel
          control={
            <Switch
              checked={nav}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setnav(event.target.checked);
                props.info.navbar = event.target.checked;
                props.setInfo(props.info);
              }}
              color="primary"
            />
          }
          label="Navbar"
        />
      ) : null}
      {activeStep === 2 ? (
        <FormControlLabel
          control={
            <Switch
              checked={img}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setimg(event.target.checked);
                props.info.imagesClickable = event.target.checked;
                props.setInfo(props.info);
              }}
              color="primary"
            />
          }
          label="Images Clickable"
        />
      ) : null}
    </div>
  );
};

export default Footer;
