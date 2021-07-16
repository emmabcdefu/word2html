import React from 'react';
import clsx from 'clsx';
// Mui Components
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton/IconButton';
// Functions
import generate from '../TextTransform/Generate';
// Mui-Icons
import CustomEditBox from '../Custom/editBox';
import Delete from '../../mui-icons/Delete';
// Types
import Info from '../../types/Info';
import ElementInfoBase from '../../types/ElementInfoBase';
import ElementInfo from '../../types/ElementInfo';
import ElementInfoTable from '../../types/ElementInfoTable';

const useStyles = makeStyles(() => ({
  textarea: {
    width: '100%',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    height: 'calc(100vh - 208px)',
  },
  flexitem: {
    width: '50%',
    padding: 16,
    'overflow-x': 'hidden',
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
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='black'><polygon points='50,00 0,50 100,50'/></svg>\")",
    },
    '&::-webkit-scrollbar-button:single-button:vertical:increment': {
      height: 12,
      width: 16,
      backgroundPosition: 'center 4px',
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='black'><polygon points='0,0 100,0 50,50'/></svg>\")",
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
    '& .report': {
      fontFamily: 'Lato',
      position: 'relative',
      '& h1, h2, h3, h4, a, strong': {
        color: '#1f4484',
        fontWeight: 700,
      },
      '& h1, h2, h3': {
        textTransform: 'uppercase',
        letterSpacing: 1,
      },
      '& h1': {
        textAlign: 'center',
        fontSize: 48,
      },
      '& h2': {
        fontSize: 22,
        paddingTop: '0.25em',
        borderTop: '4px solid #80C342',
        '& .number': {
          fontSize: 24,
        },
        '& span.chapter': {
          position: 'absolute',
          left: '-1.25em',
        },
      },
      '& h3': {
        fontSize: 18,
        '& span.chapter': {
          position: 'absolute',
          left: '-2em',
        },
      },
      '& h4': {
        fontSize: 16,
        '& span.chapter': {
          position: 'absolute',
          left: '-2.5em',
        },
      },
      '& p, li': {
        textAlign: 'justify',
        fontSize: 15,
      },
      '& .small': {
        fontSize: 13,
      },
      '& .footnote': {
        borderTop: '1px solid #666666',
        fontSize: 12.75,
      },
      '& .footnote sup::before': {
        display: 'block',
        content: ' ',
        marginTop: -150,
        height: 150,
        visibility: 'hidden',
        pointerEvents: 'none',
      },
      '& li': {
        listStyle: 'none',
      },
      '& li::before': {
        content: '',
        backgroundImage:
          'url(\'data:image/svg+xml,utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="100 0, 100 100, 0 100" fill="%2379b51e"/></svg>\')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        paddingRight: 14,
        marginRight: 14,
      },
      '& img': {
        maxWidth: '100%',
        margin: 'auto',
        display: 'block',
      },
      '& .fig-caption': {
        paddingTop: '0.5em',
        borderTop: '1px solid #81d742',
        color: '#1f4484',
        textAlign: 'center',
      },
      '& .two-column': {
        display: 'flex',
        '& div': {
          width: 'calc(50% - 20px)',
        },
        '& div:first-of-type': {
          paddingRight: 40,
        },
      },
      '& .row-images': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  },

  style: {
    textAlign: 'center',
  },
  headtable: {
    display: 'flex',
    border: '2px solid white',
    justifyContent: 'center',
  },
  table: {
    display: 'flex',
    border: '1px solid white',
    '&> div': {
      flexGrow: 1,
    },
    'overflow-x': 'scroll',
  },
  tableElement: {
    border: '1px solid white',
  },
}));

interface ChildProps {
  info: Info;
  setInfo: (info: Info) => void;
}

const StepThree: React.FC<ChildProps> = (props: ChildProps) => {
  const classes = useStyles();

  const { info } = props;
  const { content, path } = info;

  const update = () => {
    const html = document.getElementById('html')!;
    html.innerHTML = generate(content, path, false, false);
  };

  const i = (myid: string) => {
    let myIndex = -1;
    Object.values(content).forEach((value, index) => {
      const object = value as ElementInfoBase;
      if (object.id === myid) {
        myIndex = index;
      }
    });
    return myIndex;
  };

  const editBoxes = (value: ElementInfo, inDiv: boolean) => {
    if (
      [
        'h1',
        'h2',
        'h3',
        'h4',
        'p',
        'list',
        'img',
        'iframe',
        'fig-caption',
        'footnote',
      ].includes(value.element)
    ) {
      const object = value as ElementInfoBase;
      return (
        <CustomEditBox
          item={object}
          inDiv={inDiv}
          info={props.info}
          setInfo={props.setInfo}
          render={update}
        />
      );
    }
    if (['div', 'row-images'].includes(value.element)) {
      const object = value as ElementInfoTable;
      return (
        <div>
          <div className={classes.headtable}>
            <p>Table element</p>
            <IconButton
              onClick={() => {
                info.content.splice(i(object.id), 1);
                props.setInfo(info);
                // pre-render
                update();
                // remove the box
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const child = document.getElementById(object.id)!.parentElement;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                child!.parentElement!.removeChild(child!);
              }}
            >
              <Delete />
            </IconButton>
          </div>
          <div className={classes.table} id={object.id}>
            {object.content.map((listobject) => (
              <div
                className={classes.tableElement}
                key={`${object.id}-row${object.content.indexOf(listobject)}`}
              >
                {listobject.map((subobject) => (
                  <div key={subobject.id}>{editBoxes(subobject, true)}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <div>Sorry, {value.element} is not yet handle.</div>;
  };

  return (
    <div className={classes.flex}>
      <div className={classes.flexitem} id="edit">
        {content.map((object: ElementInfo) => (
          <div key={object.id}>{editBoxes(object, false)}</div>
        ))}
      </div>
      <div className={clsx(classes.flexitem, classes.report)}>
        <p className={classes.style}>
          This pre-render applied the default style. To look at your style you
          can export it and look at it in a navigator.
        </p>
        <div className="container">
          <div
            className="report"
            id="html"
            dangerouslySetInnerHTML={{
              __html: generate(content, path, false, false),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepThree;
