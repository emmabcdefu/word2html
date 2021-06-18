import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize/TextareaAutosize';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

import Showresult from './showresult';
import write from '../TextTransform/Output';

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
  },
  blacktext: {
    color: 'black',
    'background-color': '#D6E1E5',
    'border-radius': '16px',
    padding: '16px 16px 16px 42px',
    margin: '10px',
    'margin-right': 'auto',
    'margin-left': 'auto',
  },
  two_column: {
    display: 'flex',
    '& div': {
      width: 'calc(50% - 20px)',
    },
    '& div:first-of-type': {
      'padding-right': '40px',
    },
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
      <div className={clsx('divstyle', classes.flexitem)}>
        <p>Title :</p>
        <TextareaAutosize
          aria-label='textarea'
          placeholder='Title'
          defaultValue={props.info.title}
          className={classes.textarea}
          onChange={(event) => {
            props.info.title = event.target.value;
            props.setInfo(props.info);
            update(write(props.info));
          }}
        />

        {props.info.content.map((content: any, e: number) => (
          <div key={`s${e}`}>
            {['p', 'list', 'h2', 'h3', 'fig-caption'].includes(content.element) ?
              <div>
                <Select
                  defaultValue={content.element}
                  onChange={(event) => {
                    props.info.content[e].element = event.target.value;
                    props.setInfo(props.info);
                    update(write(props.info));
                  }}
                >
                  <MenuItem value='p'>Paragraph</MenuItem>
                  <MenuItem value='list'>Item list</MenuItem>
                  <MenuItem value='h2'>Title (h2)</MenuItem>
                  <MenuItem value='h3'>Title (h3)</MenuItem>
                  <MenuItem value='fig-caption'>Figure caption</MenuItem>
                </Select>
                <TextareaAutosize
                  aria-label='textarea'
                  placeholder='Element'
                  defaultValue={content.content}
                  className={classes.textarea}
                  onChange={(event) => {
                    props.info.content[e].content = event.target.value;
                    props.setInfo(props.info);
                    update(write(props.info));
                  }}
                />
              </div> : content.element === 'div' ?
              <div>
                <p>complexe element : table</p>
                <div className={classes.two_column}>
                  {['1', '2'].map((nb: string) => {
                    content[`content${nb}`].map((econtent: any, ee: number) => (
                      <div key={`e${e}-nb${nb}-ee${ee}`}>
                        <Select
                          defaultValue={econtent.element}
                          onChange={(event) => {
                            props.info.content[e][`content${nb}`][ee].element = event.target.value;
                            props.setInfo(props.info);
                            update(write(props.info));
                          }}
                        >
                          <MenuItem value={'p'}>Paragraph</MenuItem>
                          <MenuItem value={'list'}>Item list</MenuItem>
                          <MenuItem value={'h2'}>Title (h2)</MenuItem>
                          <MenuItem value={'h3'}>Title (h3)</MenuItem>
                          <MenuItem value={'fig-caption'}>Figure caption</MenuItem>
                        </Select>
                        <TextareaAutosize
                          aria-label='textarea'
                          placeholder='Element'
                          defaultValue={econtent.content}
                          className={classes.textarea}
                          onChange={(event) => {
                            props.info.content[e][`content${nb}`][ee].content = event.target.value;
                            props.setInfo(props.info);
                            update(write(props.info));
                          }}
                        />
                      </div>
                    ))
                  })}
                </div>
              </div> :
              <div>
                {content.element}
              </div>
            }
          </div>
        ))}
      </div>
      <Showresult className={clsx(classes.blacktext, classes.flexitem)} info={props.info} />
    </div>
  );
};

export default StepThree;
