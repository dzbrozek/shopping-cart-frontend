import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import TableRow from '@material-ui/core/TableRow';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from 'styled-components/macro';

import { BasketRowProps } from './types';
import { ProductImage } from './styles';

const BasketRow = ({
  image,
  name,
  quantity,
  price,
  onDelete,
}: BasketRowProps): React.ReactElement => {
  const controls = useAnimation();
  const theme = useTheme();
  const quantityVariants = {
    default: {
      scale: 1,
      color: theme.palette.common.black,
    },
    updated: {
      scale: 2,
      color: theme.palette.primary.main,
    },
  };

  React.useEffect(() => {
    async function animate(): Promise<void> {
      await controls.start('updated');
      await controls.start('default');
    }
    animate();
  }, [controls, quantity]);

  return (
    <TableRow component={motion.tr} exit={{ opacity: 0, y: 300 }}>
      <TableCell>
        <ProductImage src={image} alt={name} title={name} />
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        <motion.div
          animate={controls}
          variants={quantityVariants}
          initial={false}>
          {quantity}
        </motion.div>
      </TableCell>
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
