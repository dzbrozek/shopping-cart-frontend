import styled from 'styled-components/macro';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';

export const CardContainer = styled(Card)`
  width: 300px;
`;

export const ImageContainer = styled.div`
  position: relative;
`;

export const DeleteButton = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 0;
`;
