import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { AxiosError, AxiosPromise } from 'axios';
import React from 'react';
import { cache } from 'swr';

import API from 'api';
import { BasketProductResponse, ProductResponse } from 'api/types';
import {
  BasketProductResponseFactory,
  ProductResponseFactory,
} from 'factories/api';

import { renderWithProvider } from 'utils/render';

import Basket from '../Basket';

jest.mock('api');

const mockedAPI = API as jest.Mocked<typeof API>;

describe('<Basket />', () => {
  let product: ProductResponse;

  beforeEach(() => {
    product = ProductResponseFactory.build({
      name: 'Garden Hose',
    });
    mockedAPI.products.mockResolvedValueOnce(({
      data: [product],
    } as unknown) as AxiosPromise<ProductResponse[]>);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  it('should successfully add new product', async () => {
    mockedAPI.basket.mockResolvedValueOnce(({
      data: [],
    } as unknown) as AxiosPromise<BasketProductResponse[]>);
    const newBasketProduct = BasketProductResponseFactory.build({
      product,
      quantity: 1,
    });
    mockedAPI.addProductToBasket.mockResolvedValueOnce(({
      data: newBasketProduct,
    } as unknown) as AxiosPromise<BasketProductResponse>);

    renderWithProvider(<Basket />, {
      withSnackbar: true,
      withDragAndDrop: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });

    expect(await within(table).findByText('Your basket is empty')).toBeTruthy();

    fireEvent.dragStart(screen.getByRole('listitem'));
    fireEvent.dragEnter(table);
    fireEvent.dragOver(table);
    fireEvent.drop(table);

    await waitFor(() =>
      expect(within(table).queryByText('Your basket is empty')).toBeNull(),
    );

    expect(within(table).getAllByRole('row')).toHaveLength(1);
    expect(within(table).getByText(product.name)).toBeTruthy();

    expect(mockedAPI.addProductToBasket).toHaveBeenCalledTimes(1);
    expect(mockedAPI.addProductToBasket).toHaveBeenCalledWith(
      newBasketProduct.product.uuid,
      {
        quantity: 1,
      },
    );
  });

  it('should successfully add existing product', async () => {
    const updatedBasketProduct = BasketProductResponseFactory.build({
      product,
      quantity: 3,
    });
    mockedAPI.basket.mockResolvedValueOnce(({
      data: [
        BasketProductResponseFactory.build(),
        BasketProductResponseFactory.build({
          uuid: updatedBasketProduct.uuid,
          product,
          quantity: 2,
        }),
      ],
    } as unknown) as AxiosPromise<BasketProductResponse[]>);
    mockedAPI.addProductToBasket.mockResolvedValueOnce(({
      data: updatedBasketProduct,
    } as unknown) as AxiosPromise<BasketProductResponse>);

    renderWithProvider(<Basket />, {
      withSnackbar: true,
      withDragAndDrop: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });
    const rows = within(table).getAllByRole('row');

    expect(rows).toHaveLength(2);
    expect(within(rows[1]).getByText('2')).toBeTruthy();

    fireEvent.dragStart(screen.getByRole('listitem'));
    fireEvent.dragEnter(table);
    fireEvent.dragOver(table);
    fireEvent.drop(table);

    await waitFor(() =>
      expect(mockedAPI.addProductToBasket).toHaveBeenCalledTimes(1),
    );
    expect(mockedAPI.addProductToBasket).toHaveBeenCalledWith(
      updatedBasketProduct.product.uuid,
      {
        quantity: 3,
      },
    );

    expect(within(rows[1]).getByText('3')).toBeTruthy();
  });

  it('should fail to add product', async () => {
    mockedAPI.basket.mockResolvedValueOnce(({
      data: [],
    } as unknown) as AxiosPromise<BasketProductResponse[]>);
    mockedAPI.addProductToBasket.mockRejectedValueOnce(({
      response: {
        status: 500,
      },
    } as unknown) as AxiosError);

    renderWithProvider(<Basket />, {
      withSnackbar: true,
      withDragAndDrop: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });

    expect(await within(table).findByText('Your basket is empty')).toBeTruthy();

    fireEvent.dragStart(screen.getByRole('listitem'));
    fireEvent.dragEnter(table);
    fireEvent.dragOver(table);
    fireEvent.drop(table);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Product cannot be added to the basket right now',
    );

    expect(within(table).getByText('Your basket is empty')).toBeTruthy();
  });
});
