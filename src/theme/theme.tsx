import { createTheme } from '@material-ui/core/styles';

import {
  blue,
  green,
  lightBlue,
  orange,
  purple,
  red,
} from '@material-ui/core/colors';

const Theme = createTheme({
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
