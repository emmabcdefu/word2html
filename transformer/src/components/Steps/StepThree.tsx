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
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
  },
  flexitem: {
    width: 'calc(50% - 68px)',
    borderRadius: 16,
    padding: 16,
  },
  blacktext: {
    color: 'black',
    backgroundColor: '#D6E1E5',
    marginTop: 10,
    padding: '16px 16px 16px 42px',
  },
  table: {
    display: 'flex',
    '&> div': {
      flexGrow: 1,
    }
  },
  tableElement: {
    border: '1px solid white'
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
        {props.info.content.map((object: any, key: number) => (
          <div key={key}>
            {['p', 'list', 'h2', 'h3', 'fig-caption', 'footnote', 'img'].includes(object.element) ?
              <CustomEditBox
                item={object}
                info={props.info}
                setInfo={props.setInfo}
                update={update}
              /> : ['div', 'row-images'].includes(object.element) ?
                <div>
                  <div className={classes.table}>
                    {object.content.map((listobject: any, key2: number) => (
                      <div className={classes.tableElement} key={key2}>
                        {listobject.map((subobject: any, key3: number) => (
                          <div key={key3}>
                            <CustomEditBox
                              item={subobject}
                              info={props.info}
                              setInfo={props.setInfo}
                              update={update}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div> :
                <div>
                  Sorry, {object.element} is not yet handle.
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
