import styled from 'styled-components/macro';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

export const Container = styled.div`
  flex-grow: 1;
  margin-left: ${({ theme }) => theme.spacing(2)}px;
`;

export const Summary = styled(Box)`
  margin-left: auto;
`;

export const Total = styled(Typography)`
  flex-grow: 1;
`;
