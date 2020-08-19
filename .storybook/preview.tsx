import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider as MUIThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import MUITheme from '../src/theme/mui';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story: React.ComponentType) => (
    <StyledThemeProvider theme={MUITheme}>
      <MUIThemeProvider theme={MUITheme}>
        <CssBaseline />
        <DndProvider backend={HTML5Backend}>
          <SnackbarProvider maxSnack={3}>
            <Story />
          </SnackbarProvider>
        </DndProvider>
      </MUIThemeProvider>
    </StyledThemeProvider>
  ),
];
