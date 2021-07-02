import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { green, red } from '@material-ui/core/colors';

interface ChildProps {
  status: string;
}

const IconStatus: React.FC<ChildProps> = (props) => {
  const myicon = () => {
    switch (props.status) {
      case 'Valide':
        return <DoneIcon style={{ color: green[500] }} fontSize="large" />;
      case 'Error':
        return <CloseIcon style={{ color: red[500] }} fontSize="large" />;
      default:
        return null;
    }
  };
  return myicon();
};

export default IconStatus;
