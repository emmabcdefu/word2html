import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import path from 'path';
// Mui Components
import {
  ThemeProvider,
  createStyles,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import Select from '@material-ui/core/Select/Select';
import InputBase from '@material-ui/core/InputBase/InputBase';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import TextareaAutosize from '@material-ui/core/TextareaAutosize/TextareaAutosize';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Button from '@material-ui/core/Button/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
// Theme
import Theme from '../../theme/theme';
// Functions
import generateId from '../Other/id';
// Mui-Icons
import Add from '../../mui-icons/Add';
import Delete from '../../mui-icons/Delete';
import AddCircle from '../../mui-icons/AddCircle';
// Types
import Info from '../../types/Info';
import ElementInfoBase from '../../types/ElementInfoBase';
import ElementInfo from '../../types/ElementInfo';

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
    marginLeft: 10,
    marginTop: 0,
    textAlign: 'center',
  },
  label: {
    marginLeft: 10,
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
    flexWrap: 'wrap',
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

interface ChildProps {
  info: any;
  setInfo: (info: Info) => void;
  inDiv: boolean;
  item: ElementInfoBase;
  render: () => void;
}

const CustomEditBox: React.FC<ChildProps> = (props: ChildProps) => {
  const classes = useStyles();

  const { item, inDiv, setInfo, render } = props;
  const { id, content, element } = item;
  const [number, setnumber] = React.useState(
    Object.prototype.hasOwnProperty.call(item, 'number') ? item.number : true
  );
  const [small, setsmall] = React.useState(
    Object.prototype.hasOwnProperty.call(item, 'small') ? item.small : true
  );
  const [click, setclick] = React.useState(
    Object.prototype.hasOwnProperty.call(item, 'click') ? item.click : true
  );
  const [myelement, setelement] = React.useState(element);

  const title = myelement === 'h2' || myelement === 'h3' || myelement === 'h4';
  const iframe = myelement === 'iframe';
  const txt = myelement === 'p' || myelement === 'list';
  const img = element === 'img';

  const onInputClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const elem = event.target as HTMLInputElement;
    elem.value = '';
  };

  const i = (myid: string) => {
    let myIndex = -1;
    Object.values(props.info.content).forEach((value, index) => {
      const object = value as ElementInfoBase;
      if (object.id === myid) {
        myIndex = index;
      }
    });
    return myIndex;
  };

  const iDiv = (myid: string) => {
    let myIndex = { indexDiv: -1, indexColumn: -1, index: -1 };
    Object.values(props.info.content).forEach((valueDiv, indexDiv) => {
      const objectDiv = valueDiv as ElementInfo;
      if (objectDiv.element === 'div' || objectDiv.element === 'row-images') {
        Object.values(objectDiv.content).forEach((valueRow, indexColumn) => {
          const objectRow = valueRow as ElementInfoBase[];
          Object.values(objectRow).forEach((object, index) => {
            if (object.id === myid) {
              myIndex = { indexDiv, indexColumn, index };
            }
          });
        });
      }
    });
    return myIndex;
  };

  const update = (newValue: string | boolean | number, name: string) => {
    // update info
    if (inDiv) {
      const { indexDiv, indexColumn, index } = iDiv(id);
      props.info.content[indexDiv].content[indexColumn][index][name] = newValue;
    } else {
      props.info.content[i(id)][name] = newValue;
    }
    setInfo(props.info);

    // pre-render
    render();
  };

  const deleteBox = () => {
    // update info
    if (inDiv) {
      const { indexDiv, indexColumn, index } = iDiv(id);
      props.info.content[indexDiv].content[indexColumn].splice(index, 1);
    } else {
      props.info.content.splice(i(id), 1);
    }
    setInfo(props.info);

    // pre-render
    render();

    // remove the box
    document.getElementById(id)!.parentElement!.remove();
  };

  const addBox = () => {
    // update info
    const newId = generateId();
    if (inDiv) {
      const { indexDiv, indexColumn, index } = iDiv(id);
      props.info.content[indexDiv].content[indexColumn] = props.info.content[
        indexDiv
      ].content[indexColumn]
        .slice(0, index + 1)
        .concat(
          [{ id: newId, element: 'p', content: '' }].concat(
            props.info.content[indexDiv].content[indexColumn].slice(
              index + 1,
              props.info.content[indexDiv].content[indexColumn].length
            )
          )
        );
    } else {
      const index = i(id);
      props.info.content = props.info.content
        .slice(0, index + 1)
        .concat(
          [{ id: newId, element: 'p', small: false, content: '' }].concat(
            props.info.content.slice(index + 1, props.info.content.length)
          )
        );
    }
    setInfo(props.info);

    // pre-render
    render();

    // create a new box
    const newElement = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={Theme}>
        <CustomEditBox
          item={{ id: newId, element: 'p', small: false, content: '' }}
          inDiv={inDiv}
          info={props.info}
          setInfo={setInfo}
          render={render}
        />
      </ThemeProvider>,
      newElement
    );

    // add a new box
    const parent = document.getElementById(id)!.parentElement!.parentElement;
    const myindex = inDiv ? iDiv(id).index : i(id);
    parent!.insertBefore(newElement, parent!.children[myindex + 1]);
  };

  const readPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    // update info
    const newPath = path.relative(props.info.path, event.target.files[0].path);

    if (inDiv) {
      const { indexDiv, indexColumn, index } = iDiv(id);
      props.info.content[indexDiv].content[indexColumn][index].content =
        newPath;
    } else {
      props.info.content[i(id)].content = newPath;
    }
    setInfo(props.info);

    // update text in textarea
    document.getElementById(`text-pict-${id}`)!.innerHTML = newPath;

    // pre-render
    render();
  };

  return (
    <div className={classes.box} style={boxborder(myelement)} id={id}>
      <div className={classes.firstrow}>
        <Select
          defaultValue={element}
          onChange={(
            event: React.ChangeEvent<{
              name?: string | undefined;
              value: unknown;
            }>
          ) => {
            const newValue = String(event.target.value);
            setelement(newValue);
            update(newValue, 'element');
          }}
          input={<BootstrapInput />}
        >
          {items.map((elem: { [name: string]: string }) => (
            <MenuItem value={elem.value} key={elem.value}>
              {elem.text}
            </MenuItem>
          ))}
        </Select>

        {title ? (
          <FormControlLabel
            control={
              <Switch
                checked={number}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = Boolean(event.target.value);
                  setnumber(newValue);
                  update(newValue, 'number');
                }}
                color="primary"
              />
            }
            label="Numbered"
          />
        ) : null}
        {txt ? (
          <FormControlLabel
            control={
              <Switch
                checked={small}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = Boolean(event.target.value);
                  setsmall(newValue);
                  update(newValue, 'small');
                }}
                color="primary"
              />
            }
            label="Small Size"
          />
        ) : null}
        {img ? (
          <label htmlFor={`button-pict-${id}`}>
            <input
              accept="image/png, image/jpeg"
              className={classes.input}
              id={`button-pict-${id}`}
              type="file"
              onChange={readPath}
              onClick={onInputClick}
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<AddCircle />}
            >
              Select file
            </Button>
          </label>
        ) : null}
        {img ? (
          <FormControlLabel
            control={
              <Switch
                checked={click}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = Boolean(event.target.value);
                  setclick(newValue);
                  update(newValue, 'click');
                }}
                color="primary"
              />
            }
            label="Image clickable"
          />
        ) : null}
        {iframe ? (
          <div className={classes.firstrow}>
            <p>Width :</p>
            <TextareaAutosize
              defaultValue={
                Object.prototype.hasOwnProperty.call(item, 'width')
                  ? item.width
                  : 800
              }
              className={clsx(classes.textarea, classes.textareasize)}
              onChange={(
                event: React.ChangeEvent<{
                  name?: string | undefined;
                  value: unknown;
                }>
              ) => {
                const newValue = String(event.target.value);
                update(newValue, 'width');
              }}
            />
            <p className={classes.label}>Height : </p>
            <TextareaAutosize
              defaultValue={
                Object.prototype.hasOwnProperty.call(item, 'height')
                  ? item.height
                  : 600
              }
              className={clsx(classes.textarea, classes.textareasize)}
              onChange={(
                event: React.ChangeEvent<{
                  name?: string | undefined;
                  value: unknown;
                }>
              ) => {
                const newValue = String(event.target.value);
                update(newValue, 'height');
              }}
            />
          </div>
        ) : null}

        <div>
          <IconButton onClick={deleteBox}>
            <Delete />
          </IconButton>
          <IconButton onClick={addBox}>
            <Add />
          </IconButton>
        </div>
      </div>

      {img ? (
        <p className={classes.textarea} id={`text-pict-${id}`}>
          {content}
        </p>
      ) : (
        <TextareaAutosize
          defaultValue={content}
          className={classes.textarea}
          id={`text-pict-${id}`}
          onChange={(
            event: React.ChangeEvent<{
              name?: string | undefined;
              value: unknown;
            }>
          ) => {
            const newValue = String(event.target.value);
            update(newValue, 'content');
          }}
        />
      )}
    </div>
  );
};

export default CustomEditBox;
