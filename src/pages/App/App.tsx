import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/macro';
import { ThemeProvider as MUIThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { DndProvider } from 'react-dnd';
import { SWRConfig } from 'swr';

import Basket from 'pages/Basket';

import MUITheme from '../../theme/mui';
import NavBar from './NavBar';

function App(): React.ReactElement {
  return (
    <StyledThemeProvider theme={MUITheme}>
      <MUIThemeProvider theme={MUITheme}>
        <CssBaseline />

        <SWRConfig
          value={{
            revalidateOnFocus: false,
          }}>
          <DndProvider backend={HTML5Backend}>
            <SnackbarProvider maxSnack={3}>
              <NavBar />

              <Basket />
            </SnackbarProvider>
          </DndProvider>
        </SWRConfig>
      </MUIThemeProvider>
    </StyledThemeProvider>
  );
}

export default App;
