import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select/Select';
import InputBase from '@material-ui/core/InputBase/InputBase';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import TextareaAutosize from '@material-ui/core/TextareaAutosize/TextareaAutosize';
import IconButton from '@material-ui/core/IconButton/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import write from '../TextTransform/Output';
import Theme from '../../theme/theme';

const BootstrapInput = withStyles(() =>
  createStyles({
    input: {
      borderRadius: 4,
      position: 'relative',
      border: '1px solid #ced4da',
      font: '400 16px Lato',
      padding: '10px 26px 10px 12px',
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }),
)(InputBase);

const useStyles = makeStyles(() => ({
  root: {
    'padding': '0.7rem',
  },
  textarea: {
    width: 'calc(100% - 1.4rem)',
    padding: '0.7rem',
    font: '400 16px Lato',
    color: 'white',
    backgroundColor: '#424242',
    marginTop: 10,
    border: '1px solid #ced4da',
    borderRadius: 4,
    resize: 'none',
    '&:focus': {
      outline: 'none',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  box: {
    width: 'calc(100% - 26px)',
    'background-color': '#424242',
    padding: '10px 10px 6px 10px',
    margin: '10px 0 10px 0',
  },
  firstrow: {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'space-between',
  },
}));

interface ChildProps {
  info: any;
  item: { [name: string]: string };
  setInfo: (info: string) => void;
  update: (element: string) => void;
}

const CustomEditBox: React.FC<ChildProps> = (props) => {
  const classes = useStyles();

  const items = [
    { value: 'h1', text: 'Title (h1)' },
    { value: 'h2', text: 'Title (h2)' },
    { value: 'h3', text: 'Title (h3)' },
    { value: 'p', text: 'Paragraph' },
    { value: 'list', text: 'Item list' },
    { value: 'img', text: 'Image' },
    { value: 'fig-caption', text: 'Figure caption' },
    { value: 'footnote', text: 'Footnote' },
  ];

  const boxborderColor = (value: string) => {
    switch (value) {
      case 'p':
        return '#D6E1E5';
      case 'list':
        return '#80C342';
      case 'fig-caption':
        return '#EEEE9B';
      case 'h2':
        return '#001D4A';
      case 'h3':
        return '#006992';
      case 'footnote':
        return '#fdb0c0';
      default:
        return '#ECA400';
    }
  };

  const boxborder = (value: string) => {
    const mystyle: CSSProperties = {
      borderLeft: '5px solid ' + boxborderColor(value)
    };
    return mystyle;
  };

  const hex = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  const id = hex() + '-' + hex() + '-' + hex() + '-' + hex();

  const index = () => {
    const child = document.getElementById(id)!.parentElement;
    return Array.prototype.indexOf.call(child!.parentElement!.children, child);
  };

  const updateElement = (event: React.ChangeEvent<any>) => {
    props.info.content[index()].element = event.target.value;
    props.setInfo(props.info);
    props.update(write(props.info));
    document.getElementById(id)!.style.borderLeftColor = boxborderColor(event.target.value);
  };

  const updateContent = (event: React.ChangeEvent<any>) => {
    props.info.content[index()].content = event.target.value;
    props.setInfo(props.info);
    props.update(write(props.info));
  };

  const deleteBox = () => {
    props.info.content.splice(index(), 1);
    props.setInfo(props.info);
    props.update(write(props.info));
    const child = document.getElementById(id)!.parentElement;
    child!.parentElement!.removeChild(child!);
  };

  const addBox = () => {
    props.info.content = props.info.content.slice(0, index() + 1).concat(
      [{ element: 'p', content: '' }].concat(
        props.info.content.slice(index() + 1, props.info.content.length)
      )
    );
    props.setInfo(props.info);
    props.update(write(props.info));
    const newElement = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={Theme}>
        <CustomEditBox
          item={{ element: 'p', content: '' }}
          info={props.info}
          setInfo={props.setInfo}
          update={props.update}
        />
      </ThemeProvider>,
      newElement
    );
    const parent = document.getElementById(id)!.parentElement!.parentElement;
    parent!.insertBefore(newElement, parent!.children[index() + 1]);
  };

  return (
    <div
      className={classes.box}
      style={boxborder(props.item.element)}
      id={id}
    >
      <div className={classes.firstrow}>
        <Select
          defaultValue={props.item.element}
          onChange={updateElement}
          input={<BootstrapInput />}
        >
          {items.map((elem: any) => (
            <MenuItem value={elem.value} key={elem.value}>{elem.text}</MenuItem>
          ))}
        </Select>

        <div>
          <IconButton onClick={deleteBox}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={addBox}>
            <AddIcon />
          </IconButton>
        </div>
      </div>

      <TextareaAutosize
        aria-label="textarea"
        placeholder="Content"
        defaultValue={props.item.content}
        className={classes.textarea}
        onChange={updateContent}
      />
    </div>
  );
};

export default CustomEditBox;
