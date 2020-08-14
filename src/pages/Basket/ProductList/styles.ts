import styled from 'styled-components/macro';
import IconButton from '@material-ui/core/IconButton';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ListContainer = styled.div`
  overflow-y: scroll;
  padding: 0 ${({ theme }) => theme.spacing(2)}px;
`;

export const AddProductButton = styled(IconButton)`
  margin-left: auto;
`;
