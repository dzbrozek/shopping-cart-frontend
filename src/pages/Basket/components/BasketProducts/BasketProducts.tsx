import { useSnackbar } from 'notistack';
import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import API from 'api';
import { EmptyTableRow } from 'components/EmptyTableRow';

import useBasket from '../../hooks/useBasket';
import { Container, Summary, Total } from './styles';
import BasketRow from '../BasketRow';

const BasketProducts = (): React.ReactElement => {
  const {
    data: basketData,
    error: basketError,
    mutate: mutateBasket,
  } = useBasket();
  const { enqueueSnackbar } = useSnackbar();

  const removeProduct = (productId: string) => async (): Promise<void> => {
    const oldBasket = [...(basketData || [])];

    await mutateBasket(
      oldBasket.filter(
        (basketProduct) => basketProduct.product.uuid !== productId,
      ),
      false,
    );
    try {
      await API.deleteProduct(productId);
    } catch (e) {
      enqueueSnackbar('Product cannot be removed right now', {
        variant: 'error',
      });
      await mutateBasket(oldBasket, false);
    }
  };

  const clearBasket = async (): Promise<void> => {
    const oldBasket = [...(basketData || [])];

    await mutateBasket([], false);
    try {
      await API.clearBasket();
    } catch (e) {
      enqueueSnackbar('Basket cannot be cleared right now', {
        variant: 'error',
      });
      await mutateBasket(oldBasket, false);
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" minHeight="50px">
        <Typography variant="h5">Basket</Typography>
      </Box>
      <Box padding={2}>
        {!basketData && !basketError ? (
          <Box justifyContent="center" display="flex" padding={2}>
            <CircularProgress />
          </Box>
        ) : null}

        {basketError ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Unable to load basket.
          </Alert>
        ) : null}

        {basketData ? (
          <Table aria-label="Product basket">
            <TableBody>
              {basketData.map(({ uuid, quantity, product }) => (
                <BasketRow
                  key={uuid}
                  quantity={quantity}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.image}
                  onDelete={removeProduct(product.uuid)}
                />
              ))}
              {!basketData.length ? (
                <EmptyTableRow>
                  <TableCell colSpan={5} align="center">
                    Your basket is empty
                  </TableCell>
                </EmptyTableRow>
              ) : null}
            </TableBody>
          </Table>
        ) : null}
      </Box>

      {basketData?.length ? (
        <>
          <Summary width="50%" marginTop={2}>
            <Box display="flex" marginBottom={1}>
              <Total variant="h5">Total:</Total>
              <Typography variant="h5">
                $
                {basketData
                  .map(
                    (basketProduct) =>
                      basketProduct.quantity *
                      Number(basketProduct.product.price),
                  )
                  .reduce((prev, current) => prev + current, 0)}
              </Typography>
            </Box>

            <Divider orientation="horizontal" />
          </Summary>

          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button variant="outlined" color="primary">
              Share
            </Button>

            <Box marginLeft={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={clearBasket}>
                Clear
              </Button>
            </Box>
          </Box>
        </>
      ) : null}
    </Container>
  );
};

export default BasketProducts;
