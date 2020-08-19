import { AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import React from 'react';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { mutate } from 'swr';

import API from 'api';
import useMe from 'hooks/useMe';

import useProducts from '../../hooks/useProducts';
import ProductCard from '../ProductCard';
import { Container, ListContainer, AddProductButton } from './styles';
import AddProductDialog from '../AddProductDialog';

const ProductList = (): React.ReactElement => {
  const { data: meData } = useMe();
  const {
    data: productsData,
    error: productsError,
    mutate: mutateProducts,
  } = useProducts();
  const { enqueueSnackbar } = useSnackbar();
  const [addProductDialogOpen, setAddProductDialogOpen] = React.useState(false);

  const deleteProduct = (productId: string) => async (): Promise<void> => {
    const oldData = [...(productsData || [])];
    await mutateProducts(
      oldData.filter((product) => product.uuid !== productId),
      false,
    );

    try {
      await API.deleteProduct(productId);
      await mutate('/basket/');
    } catch (e) {
      enqueueSnackbar('Product cannot be deleted right now', {
        variant: 'error',
      });
      await mutateProducts(oldData, false);
    }
  };

  let content;

  if (productsError) {
    content = (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Unable to load products.
      </Alert>
    );
  } else if (!productsData) {
    content = (
      <Box justifyContent="center" display="flex" padding={2}>
        <CircularProgress />
      </Box>
    );
  } else {
    content =
      productsData.length === 0 ? (
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          No product to display
        </Alert>
      ) : (
        <Box role="list" marginRight={2}>
          <AnimatePresence initial={false}>
            {productsData.map((product) => (
              <Box marginY={2} key={product.uuid}>
                <ProductCard
                  product={product}
                  onDelete={
                    meData?.isAdmin ? deleteProduct(product.uuid) : undefined
                  }
                />
              </Box>
            ))}
          </AnimatePresence>
        </Box>
      );
  }

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
            onClick={() => setAddProductDialogOpen(true)}>
            <AddIcon />
          </AddProductButton>
        ) : null}
      </Box>

      <ListContainer>{content}</ListContainer>

      <AddProductDialog
        open={addProductDialogOpen}
        onClose={() => setAddProductDialogOpen(false)}
      />
    </Container>
  );
};

export default ProductList;
