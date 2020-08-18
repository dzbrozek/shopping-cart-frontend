import { motion } from 'framer-motion';
import React from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import { useDrag } from 'react-dnd';

import { DraggableItemType } from 'core/constants';

import { CardContainer, ImageContainer, DeleteButton } from './styles';
import { ProductCardProps } from './types';

const ProductCard = ({
  product,
  onDelete,
}: ProductCardProps): React.ReactElement => {
  const { uuid, name, price, image } = product;
  const drag = useDrag({
    item: {
      type: DraggableItemType.ProductCard,
      productId: uuid,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })[1];

  return (
    <CardContainer
      role="listitem"
      innerRef={drag}
      component={
        motion.div as React.ElementType<React.HTMLAttributes<HTMLElement>>
      }
      exit={{ opacity: 0 }}>
      <ImageContainer>
        <CardMedia
          component="img"
          alt={name}
          height="140"
          image={image}
          title={name}
        />
        {onDelete ? (
          <DeleteButton
            color="secondary"
            aria-label="Delete product"
            onClick={onDelete}>
            <ClearIcon />
          </DeleteButton>
        ) : null}
      </ImageContainer>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          ${price}
        </Typography>
      </CardContent>
    </CardContainer>
  );
};

export default ProductCard;
