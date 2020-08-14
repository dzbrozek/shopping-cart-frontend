import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import ProductCard from '../ProductCard';
import { Container, ListContainer, AddProductButton } from './styles';

const ProductList = (): React.ReactElement => {
  const deleteProduct = (): void => {
    // eslint-disable-next-line no-alert
    alert('delete product');
  };

  const addProduct = (): void => {
    // eslint-disable-next-line no-alert
    alert('add product');
  };

  return (
    <Container>
      <Box
        marginBottom={0}
        width="100%"
        display="flex"
        alignItems="center"
        minHeight="50px">
        <Typography variant="h5">Products</Typography>

        <AddProductButton
          color="primary"
          aria-label="add product"
          onClick={addProduct}>
          <AddIcon />
        </AddProductButton>
      </Box>

      <ListContainer>
        <Box marginY={2}>
          <ProductCard
            key="1"
            name="Diamond"
            price={100}
            image="https://earthsky.org/upl/2014/04/diamond-e1490980692833.jpg"
            onDelete={deleteProduct}
          />
        </Box>

        <Box marginY={1}>
          <ProductCard
            key="2"
            name="Diamond"
            price={45.67}
            image="https://earthsky.org/upl/2014/04/diamond-e1490980692833.jpg"
          />
        </Box>

        <Box marginY={2}>
          <ProductCard
            key="3"
            name="Diamond"
            price={100}
            image="https://earthsky.org/upl/2014/04/diamond-e1490980692833.jpg"
          />
        </Box>

        <Box marginY={2}>
          <ProductCard
            key="4"
            name="Diamond"
            price={100}
            image="https://earthsky.org/upl/2014/04/diamond-e1490980692833.jpg"
          />
        </Box>

        <Box marginY={2}>
          <ProductCard
            key="5"
            name="Diamond"
            price={100}
            image="https://earthsky.org/upl/2014/04/diamond-e1490980692833.jpg"
          />
        </Box>
      </ListContainer>
    </Container>
  );
};

export default ProductList;
