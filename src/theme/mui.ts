import { createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import pink from '@material-ui/core/colors/pink';

const MUITheme = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});

export default MUITheme;
