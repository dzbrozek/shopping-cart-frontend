import React from 'react';
import styled, { css } from 'styled-components/macro';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export const Container = styled.div`
  margin-left: ${({ theme }) => theme.spacing(2)}px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Summary = styled(Box)`
  margin-left: auto;
`;

export const Total = styled(Typography)`
  flex-grow: 1;
`;

export const DropContainer = styled.div<{ isDragging: boolean }>`
  ${({ isDragging, theme }) =>
    isDragging
      ? css`
          border: 2px dashed ${theme.palette.primary.main};
        `
      : css``};
  min-height: 500px;
  flex: 1;
`;
