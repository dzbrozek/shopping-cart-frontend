import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import { EmptyTableRow } from 'components/EmptyTableRow';

import { Container, Summary, Total } from './styles';
import BasketRow from '../BasketRow';

const BasketProducts = (): React.ReactElement => {
  const removeProduct = (): void => {
    // eslint-disable-next-line no-alert
    alert('remove product from basket');
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" minHeight="50px">
        <Typography variant="h5">Basket</Typography>
      </Box>
      <Box padding={2}>
        <Table aria-label="basket table">
          <TableBody>
            <BasketRow
              name="Diamond"
              quantity={1}
              price={548.23}
              image="https://designmodo.com/demo/shopping-cart/item-1.png"
              onDelete={removeProduct}
            />
            <BasketRow
              name="Diamond"
              quantity={2}
              price={548.23}
              image="https://designmodo.com/demo/shopping-cart/item-1.png"
              onDelete={removeProduct}
            />
            <BasketRow
              name="Diamond"
              quantity={3}
              price={548.23}
              image="https://designmodo.com/demo/shopping-cart/item-1.png"
              onDelete={removeProduct}
            />
            <EmptyTableRow>
              <TableCell colSpan={5} align="center">
                Empty basket
              </TableCell>
            </EmptyTableRow>
          </TableBody>
        </Table>
      </Box>

      <Summary width="50%" marginTop={2}>
        <Box display="flex" marginBottom={1}>
          <Total variant="h5">Total:</Total>
          <Typography variant="h5">$500</Typography>
        </Box>

        <Divider orientation="horizontal" />
      </Summary>

      <Box display="flex" justifyContent="flex-end" marginTop={2}>
        <Button variant="outlined" color="primary">
          Share
        </Button>
        <Box marginLeft={2}>
          <Button variant="outlined" color="secondary">
            Clean
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default BasketProducts;
