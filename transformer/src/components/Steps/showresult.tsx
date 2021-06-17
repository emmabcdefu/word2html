import React from 'react';
import clsx from 'clsx';

import write from '../TextTransform/Output';


interface ChildProps {
  info: any;
  className: any;
}

const Showresult: React.FC<ChildProps> = (props) => {

  return (
    <div className={clsx('container', props.className)}>
      <div className='report' id="html" dangerouslySetInnerHTML={{__html: write(props.info)}}/>
    </div>
  );
};

export default Showresult;
