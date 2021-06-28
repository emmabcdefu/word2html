import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import {
  ThemeProvider,
  createStyles,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import clsx from 'clsx';
import Select from '@material-ui/core/Select/Select';
import InputBase from '@material-ui/core/InputBase/InputBase';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import IconButton from '@material-ui/core/IconButton/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
// import Button from '@material-ui/core/Button/Button';
// import { AddCircle } from '@material-ui/icons';

import ContentEditable from 'react-contenteditable';
import render from '../TextTransform/Render';
import Theme from '../../theme/theme';
import generateId from '../Other/id';

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
  })
)(InputBase);

const useStyles = makeStyles(() => ({
  input: {
    display: 'none',
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
  textareasize: {
    width: 40,
    marginTop: 0,
    marginLeft: 10,
    textAlign: 'center',
  },
  box: {
    backgroundColor: '#424242',
    padding: '10px 10px 6px 10px',
    margin: 10,
  },
  firstrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const items = [
  { value: 'h1', text: 'Title (h1)' },
  { value: 'h2', text: 'Title (h2)' },
  { value: 'h3', text: 'Title (h3)' },
  { value: 'h4', text: 'Title (h4)' },
  { value: 'p', text: 'Paragraph' },
  { value: 'list', text: 'Item list' },
  { value: 'img', text: 'Image' },
  { value: 'iframe', text: 'Embeded' },
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
    case 'h1':
      return '#8a2387';
    case 'h2':
      return '#001D4A';
    case 'h3':
      return '#006992';
    case 'h4':
      return '#006992';
    case 'footnote':
      return '#fdb0c0';
    default:
      return '#ECA400';
  }
};

const boxborder = (value: string) => {
  const mystyle: CSSProperties = {
    borderLeft: `5px solid ${boxborderColor(value)}`,
  };
  return mystyle;
};

const diplay = (value: boolean) => {
  if (value) {
    const mystyle: CSSProperties = {};
    return mystyle;
  }
  const mystyle: CSSProperties = {
    display: 'none',
  };
  return mystyle;
};

interface ChildProps {
  info: any;
  inDiv: boolean;
  item: any;
  setInfo: (info: any) => void;
  update: (element: string) => void;
}

const CustomEditBox: React.FC<ChildProps> = (props) => {
  const classes = useStyles();

  const { item } = props;
  const { id, element, number, content, small } = item;

  // const [image, setImg] = React.useState(props.item.element === 'img');
  const [title, settitle] = React.useState(
    element === 'h2' || element === 'h3' || element === 'h4'
  );
  const [iframe, setiframe] = React.useState(element === 'iframe');
  const [txt, settxt] = React.useState(element === 'p' || element === 'list');

  // const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
  //   const element = event.target as HTMLInputElement;
  //   element.value = '';
  // };

  const index = () => {
    const child = document.getElementById(id)!.parentElement;
    return Array.prototype.indexOf.call(child!.parentElement!.children, child);
  };

  const indexColumn = () => {
    const child = document.getElementById(id)!.parentElement!.parentElement!;
    return Array.prototype.indexOf.call(child!.parentElement!.children, child);
  };

  const indexDiv = () => {
    const child = document.getElementById(id)!.parentElement!.parentElement!
      .parentElement!.parentElement!.parentElement;
    return Array.prototype.indexOf.call(child!.parentElement!.children, child);
  };

  const updateElement = (event: React.ChangeEvent<any>) => {
    if (props.inDiv) {
      // update style of the div
      // if (event.target.value === 'img') setImg(true);
      // else if (props.info.content[index()].element === 'img') setImg(false);

      const newElem = event.target.value;
      const oldElem =
        props.info.content[indexDiv()].content[indexColumn()][index()].element;

      if (newElem === 'h2' || newElem === 'h3' || newElem === 'h4')
        settitle(true);
      else if (oldElem === 'h2' || oldElem === 'h3' || oldElem === 'h4')
        settitle(false);
      if (newElem === 'iframe') setiframe(true);
      else if (oldElem === 'iframe') setiframe(false);
      if (newElem === 'p' || newElem === 'list') settxt(true);
      else if (oldElem === 'p' || oldElem === 'list') settxt(false);

      if (newElem === 'iframe') {
        props.info.content[indexDiv()].content[indexColumn()][
          index()
        ].width = 800;
        props.info.content[indexDiv()].content[indexColumn()][
          index()
        ].height = 600;
      }

      // update info
      props.info.content[indexDiv()].content[indexColumn()][
        index()
      ].element = newElem;
    } else {
      // update style of the div
      // if (event.target.value === 'img') setImg(true);
      // else if (props.info.content[index()].element === 'img') setImg(false);

      const newElem = event.target.value;
      const oldElem = props.info.content[index()].element;

      if (newElem === 'h2' || newElem === 'h3' || newElem === 'h4')
        settitle(true);
      else if (oldElem === 'h2' || oldElem === 'h3' || oldElem === 'h4')
        settitle(false);
      if (newElem === 'iframe') setiframe(true);
      else if (oldElem === 'iframe') setiframe(false);
      if (newElem === 'p' || newElem === 'list') settxt(true);
      else if (oldElem === 'p' || oldElem === 'list') settxt(false);

      if (newElem === 'iframe') {
        props.info.content[index()].width = 800;
        props.info.content[index()].height = 600;
      }

      // update info
      props.info.content[index()].element = newElem;
    }

    // update info
    props.setInfo(props.info);
    props.update(render(props.info.content));

    // update style of the div
    document.getElementById(id)!.style.borderLeftColor = boxborderColor(
      event.target.value
    );
  };

  const updateContent = (event: React.ChangeEvent<any>) => {
    // update info
    if (props.inDiv) {
      props.info.content[indexDiv()].content[indexColumn()][index()].content =
        event.target.value;
    } else {
      props.info.content[index()].content = event.target.value;
    }
    props.setInfo(props.info);
    props.update(render(props.info.content));
  };

  const update = (event: React.ChangeEvent<any>, name: string) => {
    // update info
    if (props.inDiv) {
      props.info.content[indexDiv()].content[indexColumn()][index()][name] =
        event.target.value;
    } else {
      props.info.content[index()][name] = event.target.value;
    }
    props.setInfo(props.info);
    props.update(render(props.info.content));
  };

  const deleteBox = () => {
    // update info
    if (props.inDiv) {
      props.info.content[indexDiv()].content[indexColumn()].splice(index(), 1);
    } else {
      props.info.content.splice(index(), 1);
    }
    props.setInfo(props.info);
    props.update(render(props.info.content));
    // remove the box
    const child = document.getElementById(id)!.parentElement;
    child!.parentElement!.removeChild(child!);
  };

  const addBox = () => {
    // update info
    const newId = generateId();
    if (props.inDiv) {
      props.info.content[indexDiv()].content[
        indexColumn()
      ] = props.info.content[indexDiv()].content[indexColumn()]
        .slice(0, index() + 1)
        .concat(
          [{ id: newId, element: 'p', small: false, content: '' }].concat(
            props.info.content[indexDiv()].content[indexColumn()].slice(
              index() + 1,
              props.info.content[indexDiv()].content[indexColumn()].length
            )
          )
        );
    } else {
      props.info.content = props.info.content
        .slice(0, index() + 1)
        .concat(
          [{ id: newId, element: 'p', small: false, content: '' }].concat(
            props.info.content.slice(index() + 1, props.info.content.length)
          )
        );
    }
    props.setInfo(props.info);
    props.update(render(props.info.content));
    // create a new box
    const newElement = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={Theme}>
        <CustomEditBox
          item={{ id: newId, element: 'p', small: false, content: '' }}
          inDiv={props.inDiv}
          info={props.info}
          setInfo={props.setInfo}
          update={props.update}
        />
      </ThemeProvider>,
      newElement
    );
    // add a new box
    const parent = document.getElementById(id)!.parentElement!.parentElement;
    parent!.insertBefore(newElement, parent!.children[index() + 1]);
  };

  // const readPath = (event: React.ChangeEvent<any>) => {
  //   // update text
  //   console.log(id) // TODO: fix id
  //   // document.getElementById(id)!.children[1].children[0].innerHTML = event.target.files[0].path;
  //   //update info
  //   props.info.content[index()].content = event.target.files[0].path;
  //   props.setInfo(props.info);
  //   props.update(write(props.info.content));
  // }

  return (
    <div className={classes.box} style={boxborder(element)} id={id}>
      <div className={classes.firstrow}>
        <Select
          defaultValue={element}
          onChange={updateElement}
          input={<BootstrapInput />}
        >
          {items.map((elem: { [name: string]: string }) => (
            <MenuItem value={elem.value} key={elem.value}>
              {elem.text}
            </MenuItem>
          ))}
        </Select>
        <Select
          style={diplay(title)}
          defaultValue={number || false}
          onChange={(event: React.ChangeEvent<any>) => update(event, 'number')}
          input={<BootstrapInput />}
        >
          {[
            { value: false, text: 'Not numbered' },
            { value: true, text: 'Numbered' },
          ].map((elem: any) => (
            <MenuItem value={elem.value} key={elem.value}>
              {elem.text}
            </MenuItem>
          ))}
        </Select>

        <Select
          style={diplay(txt)}
          defaultValue={small || false}
          onChange={(event: React.ChangeEvent<any>) => update(event, 'small')}
          input={<BootstrapInput />}
        >
          {[
            { value: false, text: 'Normal size' },
            { value: true, text: 'Small size' },
          ].map((elem: any) => (
            <MenuItem value={elem.value} key={elem.value}>
              {elem.text}
            </MenuItem>
          ))}
        </Select>

        <div style={diplay(iframe)} className={classes.firstrow}>
          <p>Width :</p>
          <ContentEditable
            html="800"
            className={clsx(classes.textarea, classes.textareasize)}
            onChange={(event: React.ChangeEvent<any>) => update(event, 'width')}
            contentEditable
          />
        </div>
        <div style={diplay(iframe)} className={classes.firstrow}>
          <p>Height : </p>
          <ContentEditable
            html="600"
            className={clsx(classes.textarea, classes.textareasize)}
            onChange={(event: React.ChangeEvent<any>) =>
              update(event, 'height')
            }
            contentEditable
          />
        </div>

        {/* <div style={diplay(image)}>
          <input
            accept="image/png, image/jpeg"
            className={classes.input}
            id="button-html"
            type="file"
            onChange={() => (console.log(id))readPath}
            onClick={onInputClick}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => (console.log(id))}
          >
            ID
          </Button>
          <label htmlFor="button-html">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<AddCircle />}
            >
              Change
            </Button>
          </label>
        </div> */}

        <div>
          <IconButton onClick={deleteBox}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={addBox}>
            <AddIcon />
          </IconButton>
        </div>
      </div>

      {/* <div style={diplay(image)}>
        <p className={classes.textarea}>
          {props.item.content}
        </p>
      </div> */}
      <ContentEditable
        html={content}
        className={clsx(classes.textarea)}
        onChange={updateContent}
        contentEditable
      />
    </div>
  );
};

export default CustomEditBox;
