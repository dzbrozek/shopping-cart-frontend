import { AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import React from 'react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { useDrop, DragObjectWithType } from 'react-dnd';
import Table from '@material-ui/core/Table';

import { DraggableItemType } from 'core/constants';
import API from 'api';
import { EmptyTableRow } from 'components/EmptyTableRow';

import useBasket from '../../hooks/useBasket';
import { Container, Summary, Total, DropContainer } from './styles';
import BasketRow from '../BasketRow';
import ShareBasketDialog from '../ShareBasketDialog';

const updateDataList = <T extends unknown>(
  dataList: T[],
  newData: T,
  updateIndex: number,
): T[] => {
  if (updateIndex !== -1) {
    return dataList.map((basketData, index) => {
      if (updateIndex === index) {
        return newData;
      }
      return basketData;
    });
  }
  return [...dataList, newData];
};

const BasketProducts = (): React.ReactElement => {
  const {
    data: basketData,
    error: basketError,
    mutate: mutateBasket,
  } = useBasket();
  const { enqueueSnackbar } = useSnackbar();
  const [{ isDragging }, drop] = useDrop({
    accept: DraggableItemType.ProductCard,
    collect: (monitor) => ({
      isDragging: monitor.canDrop(),
    }),
    drop({ productId, type }: DragObjectWithType & { productId: string }) {
      addProduct(productId);
    },
  });
  const [isShareDialogOpen, setShareDialogOpen] = React.useState(false);

  const addProduct = async (productId: string): Promise<void> => {
    const oldBasket = [...(basketData || [])];
    let quantity = 1;
    const existingBasketProduct = oldBasket.find(
      (basketProduct) => basketProduct.product.uuid === productId,
    );
    if (existingBasketProduct) {
      quantity = existingBasketProduct.quantity + 1;
    }

    try {
      const { data: updatedProduct } = await API.addProductToBasket(productId, {
        quantity,
      });
      await mutateBasket(
        updateDataList(
          oldBasket,
          updatedProduct,
          oldBasket.findIndex(
            (basketProduct) => basketProduct.uuid === updatedProduct.uuid,
          ),
        ),
        false,
      );
    } catch (e) {
      enqueueSnackbar('Product cannot be added to the basket right now', {
        variant: 'error',
      });
    }
  };

  const removeProduct = (productId: string) => async (): Promise<void> => {
    const oldBasket = [...(basketData || [])];

    await mutateBasket(
      oldBasket.filter(
        (basketProduct) => basketProduct.product.uuid !== productId,
      ),
      false,
    );
    try {
      await API.removeProductFromBasket(productId);
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

  let content;
  if (basketError) {
    content = (
      <Box padding={2}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Unable to load basket.
        </Alert>
      </Box>
    );
  } else if (!basketData) {
    content = (
      <Box justifyContent="center" display="flex" padding={2}>
        <CircularProgress />
      </Box>
    );
  } else {
    content = (
      <DropContainer ref={drop} isDragging={isDragging}>
        <Box padding={2}>
          <Table aria-label="Product basket">
            <TableBody>
              <AnimatePresence initial={false}>
                {basketData.map(
                  ({ uuid: productBasketUuid, quantity, product }) => (
                    <BasketRow
                      key={productBasketUuid}
                      quantity={quantity}
                      name={product.name}
                      price={Number(product.price)}
                      image={product.image}
                      onDelete={removeProduct(product.uuid)}
                    />
                  ),
                )}
              </AnimatePresence>
              {!basketData.length ? (
                <EmptyTableRow>
                  <TableCell colSpan={5} align="center">
                    Your basket is empty
                  </TableCell>
                </EmptyTableRow>
              ) : null}
            </TableBody>
          </Table>
        </Box>

        {basketData.length ? (
          <Box paddingX={2}>
            <Summary width="50%" marginTop={2}>
              <Box display="flex" marginBottom={1}>
                <Total variant="h5">Total:</Total>
                <Typography variant="h5" aria-label="total price">
                  $
                  {basketData
                    .map(
                      (basketProduct) =>
                        basketProduct.quantity *
                        Number(basketProduct.product.price),
                    )
                    .reduce((prev, current) => prev + current, 0)
                    .toFixed(2)}
                </Typography>
              </Box>

              <Divider orientation="horizontal" />
            </Summary>

            <Box display="flex" justifyContent="flex-end" marginTop={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShareDialogOpen(true)}>
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
          </Box>
        ) : null}
      </DropContainer>
    );
  }

  return (
    <Container>
      <Box display="flex" alignItems="center" minHeight="50px">
        <Typography variant="h5">Basket</Typography>
      </Box>

      {content}

      <ShareBasketDialog
        open={isShareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
      />
    </Container>
  );
};

export default BasketProducts;
