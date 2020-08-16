import { useSnackbar } from 'notistack';
import React from 'react';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import API from 'api';
import useMe from 'hooks/useMe';

import useProducts from '../../hooks/useProducts';
import ProductCard from '../ProductCard';
import { Container, ListContainer, AddProductButton } from './styles';

const ProductList = (): React.ReactElement => {
  const { data: meData } = useMe();
  const {
    data: productsData,
    error: productsError,
    mutate: mutateProducts,
  } = useProducts();
  const { enqueueSnackbar } = useSnackbar();

  const deleteProduct = (productId: string) => async (): Promise<void> => {
    const oldData = [...(productsData || [])];
    await mutateProducts(
      oldData?.filter((product) => product.uuid !== productId),
      false,
    );

    try {
      await API.deleteProduct(productId);
    } catch (e) {
      enqueueSnackbar('Product cannot be deleted right now', {
        variant: 'error',
      });
      await mutateProducts(oldData, false);
    }
  };

  const addProduct = (): void => {
    // eslint-disable-next-line no-console
    console.log('add product');
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

        {meData?.isAdmin ? (
          <AddProductButton
            color="primary"
            aria-label="Add product"
            onClick={addProduct}>
            <AddIcon />
          </AddProductButton>
        ) : null}
      </Box>

      <ListContainer>
        {!productsData && !productsError ? (
          <Box justifyContent="center" display="flex" padding={2}>
            <CircularProgress />
          </Box>
        ) : null}

        {productsError ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Unable to load products.
          </Alert>
        ) : null}

        {productsData?.length === 0 ? (
          <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            No product to display
          </Alert>
        ) : null}

        <Box role="list" paddingX={2}>
          {productsData?.map((product) => (
            <Box marginY={2} key={product.uuid}>
              <ProductCard
                name={product.name}
                price={Number(product.price)}
                image={product.image}
                onDelete={
                  meData?.isAdmin ? deleteProduct(product.uuid) : undefined
                }
              />
            </Box>
          ))}
        </Box>
      </ListContainer>
    </Container>
  );
};

export default ProductList;
