import React from 'react';

import { Container } from './styles';
import ProductList from './ProductList';
import BasketProducts from './BasketProducts';

const Basket = (): React.ReactElement => {
  return (
    <Container>
      <ProductList />

      <BasketProducts />
    </Container>
  );
};

export default Basket;
