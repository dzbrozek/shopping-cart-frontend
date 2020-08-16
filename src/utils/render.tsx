import { ThemeProvider as MUIThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { DndProvider, DndProviderProps } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/macro';
import { SWRConfig } from 'swr';

import MUITheme from 'theme/mui';

interface Config {
  withSnackbar?: boolean;
  withDragAndDrop?: boolean;
}

const TestFragment = ({
  children,
}: {
  children?: React.ReactNode;
}): React.ReactElement => {
  return <>{children}</>;
};

export function renderWithProvider(
  component: React.ReactElement,
  { withSnackbar = false, withDragAndDrop = false }: Config = {},
): RenderResult {
  const Wrapper: React.FunctionComponent = ({ children }) => {
    const SnackbarComponent = withSnackbar ? SnackbarProvider : React.Fragment;
    const DndProviderComponent: React.ComponentType<DndProviderProps<
      unknown,
      unknown
    >> = withDragAndDrop ? DndProvider : TestFragment;
    return (
      <StyledThemeProvider theme={MUITheme}>
        <MUIThemeProvider theme={MUITheme}>
          <SWRConfig
            value={{
              dedupingInterval: 0,
            }}>
            <SnackbarComponent>
              <DndProviderComponent backend={HTML5Backend}>
                {children}
              </DndProviderComponent>
            </SnackbarComponent>
          </SWRConfig>
        </MUIThemeProvider>
      </StyledThemeProvider>
    );
  };
  return {
    ...render(component, { wrapper: Wrapper }),
  };
}
