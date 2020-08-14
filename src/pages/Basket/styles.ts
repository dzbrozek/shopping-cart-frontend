import styled from 'styled-components/macro';

export const Container = styled.div`
  display: flex;
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacing(2)}px;
  height: calc(100vh - 56px);

  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: calc(100vh - 64px);
  }
`;
