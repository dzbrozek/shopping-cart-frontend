import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import TableRow from '@material-ui/core/TableRow';

import { BasketRowProps } from './types';
import { ProductImage } from './styles';

const BasketRow = ({
  image,
  name,
  quantity,
  price,
  onDelete,
}: BasketRowProps): React.ReactElement => {
  return (
    <TableRow>
      <TableCell>
        <ProductImage src={image} alt={name} title={name} />
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell align="right">${price * quantity}</TableCell>
      <TableCell align="right">
        <IconButton
          color="secondary"
          aria-label="Remove product"
          onClick={onDelete}
          title="Remove product">
          <ClearIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default BasketRow;
