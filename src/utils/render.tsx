import { ThemeProvider as MUIThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/macro';
import { SWRConfig } from 'swr';

import MUITheme from 'theme/mui';

interface Config {
  withSnackbar?: boolean;
}
export function renderWithProvider(
  component: React.ReactElement,
  { withSnackbar = false }: Config = {},
): RenderResult {
  const Wrapper: React.FunctionComponent = ({ children }) => {
    const SnackbarComponent = withSnackbar ? SnackbarProvider : React.Fragment;
    return (
      <StyledThemeProvider theme={MUITheme}>
        <MUIThemeProvider theme={MUITheme}>
          <SWRConfig
            value={{
              dedupingInterval: 0,
            }}>
            <SnackbarComponent>{children}</SnackbarComponent>
          </SWRConfig>
        </MUIThemeProvider>
      </StyledThemeProvider>
    );
  };
  return {
    ...render(component, { wrapper: Wrapper }),
  };
}
