import React from 'react';
import clsx from 'clsx';
import write from '../TextTransform/Output';

import style from '../../style_template/style.scss';

interface ChildProps {
  info: any;
  className: any;
}

const Showresult: React.FC<ChildProps> = (props) => {
  return (
    <div className={clsx(style.container, props.className)}>
      <div className={style.report} id="html" dangerouslySetInnerHTML={{__html: write(props.info)}}/>
    </div>
  );
};

export default Showresult;
