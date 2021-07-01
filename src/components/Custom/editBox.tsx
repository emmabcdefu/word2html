import React, { CSSProperties } from 'react';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Select from '@material-ui/core/Select/Select';
import InputBase from '@material-ui/core/InputBase/InputBase';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import TextareaAutosize from '@material-ui/core/TextareaAutosize/TextareaAutosize';
import IconButton from '@material-ui/core/IconButton/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
// import Button from '@material-ui/core/Button/Button';
// import { AddCircle } from '@material-ui/icons';

import render from '../TextTransform/Render';
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
  inDiv: boolean;
  item: any;
  updatebyID: (id: string, inDiv: boolean, newObject: any) => void;
  deletebyID: (id: string, inDiv: boolean) => void;
  addbyID: (id: string, inDiv: boolean) => void;
}

const CustomEditBox: React.FC<ChildProps> = (props) => {
  const classes = useStyles();

  const { item, inDiv, updatebyID, deletebyID, addbyID } = props;
  const { id, element, content } = item;

  const [myelement, setelement] = React.useState(element);
  const title = myelement === 'h2' || myelement === 'h3' || myelement === 'h4';
  const iframe = myelement === 'iframe';
  const txt = myelement === 'p' || myelement === 'list';
  // const image = myelement === 'img';

  // const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
  //   const element = event.target as HTMLInputElement;
  //   element.value = '';
  // };

  const updateElement = (event: React.ChangeEvent<any>) => {
    const newElem = event.target.value;
    setelement(newElem);

    // update info
    item.element = newElem;
    updatebyID(id, inDiv, item);
  };

  const updateContent = (event: React.ChangeEvent<any>) => {
    // update info
    item.content = event.target.value;
    updatebyID(id, inDiv, item);
  };

  const updateOption = (event: React.ChangeEvent<any>, name: string) => {
    // update info
    item[name] = event.target.value;
    updatebyID(id, inDiv, item);
  };

  const deleteBox = () => {
    // update info
    deletebyID(id, inDiv);
  };

  const addBox = () => {
    // update info
    addbyID(id, inDiv);
  };

  // const readPath = (event: React.ChangeEvent<any>) => {
  //   // update text
  //   console.log(id) // TODO: fix id
  //   // document.getElementById(id)!.children[1].children[0].innerHTML = event.target.files[0].path;
  //   //update info
  //   info.content[index()].content = event.target.files[0].path;
  //   setInfo(info);
  //   update(write(info.content));
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
          defaultValue={false}
          onChange={(event: React.ChangeEvent<any>) =>
            updateOption(event, 'number')
          }
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
          defaultValue={false}
          onChange={(event: React.ChangeEvent<any>) =>
            updateOption(event, 'small')
          }
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
          <TextareaAutosize
            defaultValue={800}
            className={clsx(classes.textarea, classes.textareasize)}
            onChange={(event: React.ChangeEvent<any>) =>
              updateOption(event, 'width')
            }
          />
        </div>
        <div style={diplay(iframe)} className={classes.firstrow}>
          <p>Height : </p>
          <TextareaAutosize
            defaultValue={600}
            className={clsx(classes.textarea, classes.textareasize)}
            onChange={(event: React.ChangeEvent<any>) =>
              updateOption(event, 'height')
            }
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
      <TextareaAutosize
        // style={diplay(!image)}
        defaultValue={content}
        className={classes.textarea}
        onChange={updateContent}
      />
    </div>
  );
};

export default CustomEditBox;
