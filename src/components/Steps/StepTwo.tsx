import React from 'react';
import fs from 'fs';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button/Button';
import { AddCircle } from '@material-ui/icons';
import DoneIcon from '@material-ui/icons/Done';
import { green } from '@material-ui/core/colors';

import analyse from '../TextTransform/Analyse';

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
  info: any;
  setInfo: (info: any) => void;
  enableNext: () => void;
}

const StepTwo: React.FC<ChildProps> = (props) => {
  const classes = useStyles();

  const [htmInput, sethtmInput] = React.useState(false);
  const [cssInput, setcssInput] = React.useState(false);
  const [jsonInput, setjsonInput] = React.useState(false);

  const onInputClick = () => (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const element = event.target as HTMLInputElement;
    element.value = '';
  };

  const readFile = (event: React.ChangeEvent<any>) => {
    if (event.target.files && event.target.files[0]) {
      fs.readFile(
        event.target.files[0].path,
        'utf8',
        (err: any, data: string) => {
          if (err) sethtmInput(false);
          else sethtmInput(true);
          const path = event.target.files[0].path
            .split('\\')
            .slice(0, -1)
            .reduce((a: string, b: string) => {
              return `${a}\\${b}`;
            });
          props.info.content = analyse(data);
          props.info.path = path;
          props.setInfo(props.info);
          if (cssInput) props.enableNext();
        }
      );
    } else {
      sethtmInput(false);
    }
  };

  const readCSS = (event: React.ChangeEvent<any>) => {
    if (event.target.files && event.target.files[0]) {
      fs.readFile(
        event.target.files[0].path,
        'utf8',
        (err: any, data: string) => {
          if (err) setcssInput(false);
          else setcssInput(true);
          props.info.style = data;
          props.setInfo(props.info);
          if (htmInput) props.enableNext();
        }
      );
    } else {
      setcssInput(false);
    }
    setcssInput(true);
  };

  const readJSON = (event: React.ChangeEvent<any>) => {
    if (event.target.files && event.target.files[0]) {
      fs.readFile(
        event.target.files[0].path,
        'utf8',
        (err: any, data: string) => {
          if (err) setjsonInput(false);
          else setjsonInput(true);
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
      );
    } else {
      setjsonInput(false);
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
          <DoneIcon
            style={{ color: green[500], display: htmInput ? '' : 'none' }}
            fontSize="large"
          />
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
          <DoneIcon
            style={{ color: green[500], display: cssInput ? '' : 'none' }}
            fontSize="large"
          />
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
          <DoneIcon
            style={{ color: green[500], display: jsonInput ? '' : 'none' }}
            fontSize="large"
          />
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
