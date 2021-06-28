import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import render from '../TextTransform/Render';
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
    height: 'calc(100vh - 206px)',
  },
  flexitem: {
    width: '50%',
    padding: 16,
    'overflow-y': 'scroll',
    '&::-webkit-scrollbar': {
      width: 16,
      backgroundColor: '#424242',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'white',
      backgroundClip: 'padding-box',
      border: '1px solid transparent',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-button:single-button': {
      backgroundColor: 'white',
      display: 'block',
      backgroundSize: 10,
      backgroundRepeat: 'no-repeat',
    },
    '&::-webkit-scrollbar-button:single-button:vertical:decrement': {
      height: 12,
      width: 16,
      backgroundPosition: 'center 4px',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='black'><polygon points='50,00 0,50 100,50'/></svg>")`,
    },
    '&::-webkit-scrollbar-button:single-button:vertical:increment': {
      height: 12,
      width: 16,
      backgroundPosition: 'center 4px',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='black'><polygon points='0,0 100,0 50,50'/></svg>")`,
    },
    'scroll-behavior': 'smooth',
  },
  report: {
    'overflow-x': 'hidden',
    '& .container': {
      padding: '16px 16px 16px 42px',
      color: 'black',
      backgroundColor: '#D6E1E5',
      borderRadius: 16,
    },
  },
  table: {
    display: 'flex',
    '&> div': {
      flexGrow: 1,
    },
  },
  tableElement: {
    border: '1px solid white',
  },
}));

interface ChildProps {
  info: any;
  setInfo: (info: string) => void;
}

const StepThree: React.FC<ChildProps> = (props) => {
  const classes = useStyles();

  const { info } = props;
  const { content } = info;

  const update = (element: string) => {
    const html = document.getElementById('html')!;
    html.innerHTML = element;
  };

  const editBoxes: (object: any) => any = (object: any) => {
    if (
      ['p', 'list', 'h2', 'h3', 'fig-caption', 'footnote', 'img'].includes(
        object.element
      )
    ) {
      return (
        <CustomEditBox
          item={object}
          inDiv={false}
          info={props.info}
          setInfo={props.setInfo}
          update={update}
        />
      );
    }
    if (['div', 'row-images'].includes(object.element)) {
      return (
        <div>
          <div className={classes.table}>
            {object.content.map((listobject: any, key2: number) => (
              <div className={classes.tableElement} key={key2}>
                {listobject.map((subobject: any, key3: number) => (
                  <div key={key3}>{editBoxes(subobject)}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <div>Sorry, {object.element} is not yet handle.</div>;
  };

  return (
    <div className={classes.flex}>
      <div className={classes.flexitem} id="edit">
        {content.map((object: any, key: number) => (
          <div key={key}>{editBoxes(object)}</div>
        ))}
      </div>
      <div className={clsx(classes.flexitem, classes.report)}>
        <div className="container">
          <div
            className="report"
            id="html"
            dangerouslySetInnerHTML={{ __html: render(content) }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepThree;
