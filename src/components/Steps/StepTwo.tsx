import React from 'react';
import fs from 'fs';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button/Button';
import { AddCircle } from '@material-ui/icons';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

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

const Alert = (props: AlertProps) => {
  const { onClose, severity, children } = props;
  return (
    <MuiAlert
      elevation={6}
      variant="filled"
      {...{ onClose, severity, children }}
    />
  );
};

interface ChildProps {
  info: any;
  setInfo: (info: any) => void;
  enableNext: () => void;
}

const StepTwo: React.FC<ChildProps> = (props) => {
  const classes: any = useStyles();

  const [htmInput, sethtmInput] = React.useState(false);
  const [cssInput, setcssInput] = React.useState(false);
  const [openAlert1, setOpenAlert1] = React.useState(false);
  const [openAlert2, setOpenAlert2] = React.useState(false);

  const onInputClick: () => any = () => (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const element = event.target as HTMLInputElement;
    element.value = '';
  };

  const handleClose1: (
    _event?: React.SyntheticEvent,
    reason?: string
  ) => void = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      setOpenAlert1(false);
    }
  };

  const handleClose2: (
    _event?: React.SyntheticEvent,
    reason?: string
  ) => void = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      setOpenAlert2(false);
    }
  };

  const readFile: (event: React.ChangeEvent<any>) => void = (
    event: React.ChangeEvent<any>
  ) => {
    fs.readFile(
      event.target.files[0].path,
      'utf8',
      (err: any, data: string) => {
        if (err) setOpenAlert1(true);
        else setOpenAlert2(true);
        const path = event.target.files[0].path
          .split('\\')
          .slice(0, -1)
          .reduce((a: string, b: string) => {
            return `${a}\\${b}`;
          });
        props.info.content = analyse(data, path);
        props.info.path = path;
        props.setInfo(props.info);
      }
    );
    sethtmInput(true);
    if (cssInput) props.enableNext();
  };

  const readCSS: (event: React.ChangeEvent<any>) => void = (
    event: React.ChangeEvent<any>
  ) => {
    if (htmInput) props.enableNext();
    fs.readFile(
      event.target.files[0].path,
      'utf8',
      (err: any, data: string) => {
        if (err) setOpenAlert1(true);
        else setOpenAlert2(true);
        props.info.style = data;
        props.setInfo(props.info);
      }
    );
    setcssInput(true);
  };

  return (
    <div className={classes.flex}>
      <div className={classes.flexrow}>
        <h3>Select the htm file of your report :</h3>
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
      </div>
      <div className={classes.flexrow}>
        <h3>Select the css file for the style of your report :</h3>
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
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openAlert1}
        autoHideDuration={2000}
        onClose={handleClose1}
      >
        <Alert onClose={handleClose1} severity="error">
          The file could not be read.
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openAlert2}
        autoHideDuration={2000}
        onClose={handleClose2}
      >
        <Alert onClose={handleClose2} severity="success">
          The file has successfully been read.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StepTwo;
