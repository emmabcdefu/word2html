import React from 'react';
import fs from 'fs';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button/Button';
// Functions
import analyse from '../TextTransform/Analyse';
// Mui-Icons
import IconStatus from '../Custom/IconStatus';
import AddCircle from '../../mui-icons/AddCircle';
// Types
import Info from '../../Interface/Info';

const useStyles = makeStyles(() => ({
  input: {
    display: 'none',
  },
  main: {
    display: 'flex',
    'flex-direction': 'row',
    'align-items': 'stretch',
  },
  divstyle: {
    'max-width': 'calc(100% - 50px)',
    'background-color': '#424242',
    'border-radius': '16px',
    padding: '16px',
    margin: '10px auto 10px auto',
  },
  flexcol: {
    display: 'flex',
    'flex-direction': 'column',
    'align-items': 'center',
    'justify-content': 'center',
  },
  flexrow: {
    display: 'flex',
    'flex-direction': 'row',
    'justify-content': 'center',
    'align-items': 'center',
    '& label': {
      margin: '0 15px 0 15px',
    },
  },
}));

interface ChildProps {
  info: Info;
  setInfo: (info: Info) => void;
  enableNext: () => void;
}

const StepTwo: React.FC<ChildProps> = (props: ChildProps) => {
  const classes = useStyles();

  const [htmInput, sethtmInput] = React.useState('');
  const [cssInput, setcssInput] = React.useState('');
  const [jsonInput, setjsonInput] = React.useState('');

  const onInputClick =
    () => (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const element = event.target as HTMLInputElement;
      element.value = '';
    };

  const readFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) sethtmInput('Error');
    else {
      fs.readFile(event.target.files[0].path, 'utf8', (err, data) => {
        if (!event.target.files || err) sethtmInput('Error');
        else {
          sethtmInput('Valide');
          const path = event.target.files[0].path
            .split('\\')
            .slice(0, -1)
            .reduce((a: string, b: string) => {
              return `${a}\\${b}`;
            });
          props.info.content = analyse(data);
          props.info.path = path;
          props.setInfo(props.info);
          if (cssInput === 'Valide') props.enableNext();
        }
      });
    }
  };

  const readCSS = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) setcssInput('Error');
    else {
      fs.readFile(event.target.files[0].path, 'utf8', (err, data) => {
        if (err) setcssInput('Error');
        else {
          setcssInput('Valide');
          props.info.style = data;
          props.setInfo(props.info);
          if (htmInput === 'Valide') props.enableNext();
        }
      });
    }
  };

  const readJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) setjsonInput('Error');
    else {
      fs.readFile(event.target.files[0].path, 'utf8', (err, data) => {
        if (!event.target.files || err) setjsonInput('Error');
        else {
          setjsonInput('Valide');
          const path = event.target.files[0].path
            .split('\\')
            .slice(0, -1)
            .reduce((a: string, b: string) => {
              return `${a}\\${b}`;
            });
          const info = JSON.parse(data);
          info.path = path;
          props.setInfo(info);
          props.enableNext();
        }
      });
    }
  };

  return (
    <div className={classes.main}>
      <div className={clsx(classes.divstyle, classes.flexcol)}>
        <h3>Select the htm file of your report :</h3>
        <div className={classes.flexrow}>
          <label htmlFor="button-html">
            <input
              accept=".htm"
              className={classes.input}
              id="button-html"
              type="file"
              onChange={readFile}
              onClick={onInputClick}
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<AddCircle />}
            >
              Select
            </Button>
          </label>
          <IconStatus status={htmInput} />
        </div>
        <h3>Select the css file for the style of your report :</h3>
        <div className={classes.flexrow}>
          <label htmlFor="button-css">
            <input
              accept=".css"
              className={classes.input}
              id="button-css"
              type="file"
              onChange={readCSS}
              onClick={onInputClick}
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<AddCircle />}
            >
              Select
            </Button>
          </label>
          <IconStatus status={cssInput} />
        </div>
      </div>
      <div className={classes.flexcol}>
        <h3>OR</h3>
      </div>
      <div className={clsx(classes.divstyle, classes.flexcol)}>
        <div className={classes.flexrow}>
          <h3>Select the JSON file to continue editing your report :</h3>
        </div>
        <div className={classes.flexrow}>
          <label htmlFor="button-json">
            <input
              accept=".json"
              className={classes.input}
              id="button-json"
              type="file"
              onChange={readJSON}
              onClick={onInputClick}
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<AddCircle />}
            >
              Select
            </Button>
          </label>
          <IconStatus status={jsonInput} />
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
