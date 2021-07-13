import React from 'react';

import Done from '../../mui-icons/Done';
import Close from '../../mui-icons/Close';

interface ChildProps {
  status: string;
}

const IconStatus: React.FC<ChildProps> = (props) => {
  const myicon = () => {
    switch (props.status) {
      case 'Valide':
        return <Done />;
      case 'Error':
        return <Close />;
      default:
        return null;
    }
  };
  return myicon();
};

export default IconStatus;
