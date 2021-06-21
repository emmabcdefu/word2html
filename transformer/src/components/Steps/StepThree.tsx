import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import write from '../TextTransform/Output';
import CustomEditBox from '../Custom/editBox';

const useStyles = makeStyles(() => ({
  textarea: {
    width: '100%',
  },
  flex: {
    display: 'flex',
    'flex-direction': 'row',
    'align-items': 'stretch',
    'justify-content': 'space-evenly',
  },
  flexitem: {
    width: 'calc(50% - 68px)',
    'border-radius': '16px',
    padding: 16,
  },
  blacktext: {
    color: 'black',
    'background-color': '#D6E1E5',
    marginTop: 10,
    padding: '16px 16px 16px 42px',
  },
  two_column: {
    display: 'flex',
    'justify-content': 'space-evenly',
  },
}));

interface ChildProps {
  info: any;
  setInfo: (info: string) => void;
}

const StepThree: React.FC<ChildProps> = (props) => {
  
  const classes = useStyles();

  const update = (element: string) => {
    const html = document.getElementById('html')!;
    html.innerHTML = element;
  };

  return (
    <div className={classes.flex}>
      <div className={classes.flexitem} id="edit">
        {props.info.content.map((content: any, e: number) => (
          <div key={e}>
            {['p', 'list', 'h2', 'h3', 'fig-caption', 'footnote', 'img'].includes(content.element) ?
              <CustomEditBox
                item={content}
                info={props.info}
                setInfo={props.setInfo}
                update={update}
              /> : content.element === 'div' ?
                <div>
                  <p>complexe element : table</p>
                  <div className={classes.two_column}>

                  </div>
                </div> :
                <div>
                  {content.element}
                </div>
            }
          </div>
        ))}
      </div>
      <div className={clsx('container', classes.blacktext, classes.flexitem)}>
        <div
          className='report'
          id="html"
          dangerouslySetInnerHTML={{ __html: write(props.info) }}
        />
      </div>
    </div>
  );
};

export default StepThree;
