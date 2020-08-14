import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/macro';
import { ThemeProvider as MUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import Basket from 'pages/Basket';

import MUITheme from '../../theme/mui';
import NavBar from './NavBar';

function App(): React.ReactElement {
  return (
    <StyledThemeProvider theme={MUITheme}>
      <MUIThemeProvider theme={MUITheme}>
        <CssBaseline />

        <>
          <NavBar />

          <Basket />
        </>
      </MUIThemeProvider>
    </StyledThemeProvider>
  );
}

export default App;
