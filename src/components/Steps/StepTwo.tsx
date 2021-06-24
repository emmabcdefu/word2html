import React from 'react';
import fs from 'fs';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button/Button';
import { AddCircle } from '@material-ui/icons';

import analyse from '../TextTransform/Analyse';

const useStyles = makeStyles(() => ({
  input: {
    display: 'none',
  },
  flex: {
    display: 'flex',
    'flex-direction': 'column',
    'max-width': 'calc(100% - 50px)',
    'background-color': '#424242',
    'border-radius': '16px',
    padding: '16px',
    margin: '10px auto 10px auto',
  },
  flexrow: {
    display: 'flex',
    'flex-direction': 'row',
    'align-items': 'center',
    '& h3': {
      'margin-right': '15px',
    },
  },
}));

interface ChildProps {
  info: any;
  setInfo: (info: any) => void;
  enableNext: () => void;
}

const StepTwo: React.FC<ChildProps> = (props) => {
  const classes: any = useStyles();

  let htmInput = false;
  let cssInput = false;

  const onInputClick: any = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const element = event.target as HTMLInputElement;
    element.value = '';
  };

  const readFile = (event: React.ChangeEvent<any>) => {
    fs.readFile(event.target.files[0].path, 'utf8', (_, data: string) => {
      const path = event.target.files[0].path
        .split('\\')
        .slice(0, -1)
        .reduce((a: string, b: string) => {
          return `${a}\\${b}`;
        });
      props.info.content = analyse(data, path);
      props.info.path = path;
      props.setInfo(props.info);
    });
    htmInput = true;
    if (cssInput) props.enableNext();
  };

  const readCSS = (event: React.ChangeEvent<any>) => {
    cssInput = true;
    if (htmInput) props.enableNext();
    fs.readFile(event.target.files[0].path, 'utf8', (_, data: string) => {
      props.info.style = data;
      props.setInfo(props.info);
    });
  };

  return (
    <div className={classes.flex}>
      <div className={classes.flexrow}>
        <h3>Select the htm file of your report :</h3>
        <input
          accept=".htm"
          className={classes.input}
          id="button-html"
          type="file"
          onChange={readFile}
          onClick={onInputClick}
        />
        <label htmlFor="button-html">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<AddCircle />}
          >
            Select
          </Button>
        </label>
      </div>
      <div className={classes.flexrow}>
        <h3>Select the css file for the style of your report :</h3>
        <input
          accept=".css"
          className={classes.input}
          id="button-css"
          type="file"
          onChange={readCSS}
          onClick={onInputClick}
        />
        <label htmlFor="button-css">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<AddCircle />}
          >
            Select
          </Button>
        </label>
      </div>
    </div>
  );
};

export default StepTwo;
