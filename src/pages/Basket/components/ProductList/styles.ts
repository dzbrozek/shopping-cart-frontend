import styled from 'styled-components/macro';
import IconButton from '@material-ui/core/IconButton';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ListContainer = styled.div`
  overflow-y: auto;
  min-width: 340px;
`;

export const AddProductButton = styled(IconButton)`
  margin-left: auto;
`;
