import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {
  blue,
  green,
  lightBlue,
  orange,
  purple,
  red,
} from '@material-ui/core/colors';

const Theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: purple,
    error: red,
    warning: orange,
    info: lightBlue,
    success: green,
  },
});

export default Theme;
