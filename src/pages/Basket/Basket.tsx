import React from 'react';

import { Container } from './styles';
import ProductList from './components/ProductList';
import BasketProducts from './components/BasketProducts';

const Basket = (): React.ReactElement => {
  return (
    <Container>
      <ProductList />

      <BasketProducts />
    </Container>
  );
};

export default Basket;
