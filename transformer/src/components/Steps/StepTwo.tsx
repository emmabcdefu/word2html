import React from 'react';
import clsx from 'clsx';
import fs from 'fs';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button/Button';
import { AddCircle } from '@material-ui/icons';

import analyse from '../TextTransform/Analyse';

const useStyles: any = makeStyles(() => ({
  input: {
    display: 'none',
  },
  flex: {
    display: 'flex',
    'flex-direction': 'row',
    'align-items': 'center',
    '& h3': {
      'margin-right': '15px',
    },
  },
}));

interface ChildProps {
  setInfo: (info: string) => void;
  handleNext: () => void;
}

const StepTwo: React.FC<ChildProps> = (props) => {
  const classes: any = useStyles();

  const onInputClick: any = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement;
    element.value = '';
  };

  const readFile = (event: any /* Typescript don't support input file */) => {
    fs.readFile(event.target.files[0].path, 'utf8', (_, data: string) => {
      //TODO: need to save the path
      props.setInfo(analyse(data));
      props.handleNext();
    });
  };

  return (
    <div className={clsx('divstyle', classes.flex)}>
      <h3>Select the htm file of your report :</h3>
      <input
        accept=".htm"
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={readFile}
        onClick={onInputClick}
      />
      <label htmlFor="contained-button-file">
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
  );
};

export default StepTwo;
