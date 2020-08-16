import userEvent from '@testing-library/user-event';
import React from 'react';
import { screen, within, waitFor } from '@testing-library/react';
import { AxiosError, AxiosPromise } from 'axios';
import { cache } from 'swr';

import API from 'api';
import { BasketProductResponse } from 'api/types';
import {
  BasketProductResponseFactory,
  ProductResponseFactory,
} from 'factories/api';
import { renderWithProvider } from 'utils/render';

import BasketProducts from '../BasketProducts';

jest.mock('api');

const mockedAPI = API as jest.Mocked<typeof API>;

describe('<BasketProducts />', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  it('should render empty basket', async () => {
    mockedAPI.basket.mockResolvedValueOnce(({
      data: [],
    } as unknown) as AxiosPromise<BasketProductResponse[]>);

    renderWithProvider(<BasketProducts />, {
      withSnackbar: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });

    expect(await within(table).findByText('Your basket is empty')).toBeTruthy();

    expect(screen.queryByText(/Total/)).toBeNull();

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should render basket error', async () => {
    mockedAPI.basket.mockRejectedValueOnce(({
      response: {
        status: 500,
      },
    } as unknown) as AxiosError);

    renderWithProvider(<BasketProducts />, {
      withSnackbar: true,
    });

    expect(await screen.findByText(/Unable to load basket/)).toBeTruthy();

    expect(screen.queryByRole('table', { name: 'Product basket' })).toBeNull();

    expect(screen.queryByText(/Total/)).toBeNull();

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should render basket with products', async () => {
    const data = [
      BasketProductResponseFactory.build({
        product: ProductResponseFactory.build({
          price: '34.99',
          name: 'Garden Hose',
        }),
        quantity: 2,
      }),
      BasketProductResponseFactory.build({
        product: ProductResponseFactory.build({
          price: '13.99',
        }),
        quantity: 1,
      }),
    ];
    mockedAPI.basket.mockResolvedValueOnce(({
      data,
    } as unknown) as AxiosPromise<BasketProductResponse[]>);

    renderWithProvider(<BasketProducts />, {
      withSnackbar: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });
    const rows = within(table).getAllByRole('row');

    expect(rows).toHaveLength(2);

    const row = within(rows[0]);
    const image = row.getByRole('img');

    expect(image).toHaveAttribute('alt', data[0].product.name);
    expect(image).toHaveAttribute('src', data[0].product.image);
    expect(row.getByText(data[0].product.name)).toBeTruthy();
    expect(row.getByText(String(data[0].quantity))).toBeTruthy();
    expect(row.getByText('$69.98')).toBeTruthy();
    expect(row.getByRole('button', { name: /Remove product/i })).toBeTruthy();

    expect(screen.getByRole('button', { name: 'Share' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeTruthy();
  });

  it('should successfully clear basket', async () => {
    mockedAPI.basket.mockResolvedValueOnce(({
      data: BasketProductResponseFactory.buildList(2),
    } as unknown) as AxiosPromise<BasketProductResponse[]>);
    mockedAPI.clearBasket.mockResolvedValueOnce(({
      data: '',
    } as unknown) as AxiosPromise<string>);

    renderWithProvider(<BasketProducts />, {
      withSnackbar: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });

    expect(within(table).getAllByRole('row')).toHaveLength(2);

    userEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(await within(table).findByText('Your basket is empty')).toBeTruthy();

    expect(mockedAPI.clearBasket).toHaveBeenCalledTimes(1);
    expect(mockedAPI.clearBasket).toHaveBeenCalledWith();
  });

  it('should fail to clear basket', async () => {
    mockedAPI.basket.mockResolvedValueOnce(({
      data: BasketProductResponseFactory.buildList(2),
    } as unknown) as AxiosPromise<BasketProductResponse[]>);
    mockedAPI.clearBasket.mockRejectedValueOnce(({
      response: {
        status: 400,
      },
    } as unknown) as AxiosError);

    renderWithProvider(<BasketProducts />, {
      withSnackbar: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });

    expect(within(table).getAllByRole('row')).toHaveLength(2);

    userEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Basket cannot be cleared right now',
    );

    expect(within(table).getAllByRole('row')).toHaveLength(2);
  });

  it('should successfully remove product from basket', async () => {
    const data = [
      BasketProductResponseFactory.build({
        product: ProductResponseFactory.build({
          name: 'Garden Hose',
        }),
      }),
      BasketProductResponseFactory.build({
        product: ProductResponseFactory.build({
          name: 'Pressure Washer',
        }),
      }),
    ];
    mockedAPI.basket.mockResolvedValueOnce(({
      data,
    } as unknown) as AxiosPromise<BasketProductResponse[]>);
    mockedAPI.deleteProduct.mockResolvedValueOnce(({
      data: '',
    } as unknown) as AxiosPromise<string>);

    renderWithProvider(<BasketProducts />, {
      withSnackbar: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });

    expect(within(table).getAllByRole('row')).toHaveLength(2);

    expect(within(table).queryByText('Garden Hose')).toBeTruthy();

    userEvent.click(
      within(within(table).getAllByRole('row')[0]).getByRole('button', {
        name: 'Remove product',
      }),
    );

    await waitFor(() =>
      expect(within(table).getAllByRole('row')).toHaveLength(1),
    );

    expect(within(table).queryByText('Garden Hose')).toBeNull();

    expect(mockedAPI.deleteProduct).toHaveBeenCalledTimes(1);
    expect(mockedAPI.deleteProduct).toHaveBeenCalledWith(data[0].product.uuid);
  });

  it('should fail to remove product from basket', async () => {
    mockedAPI.basket.mockResolvedValueOnce(({
      data: BasketProductResponseFactory.buildList(2),
    } as unknown) as AxiosPromise<BasketProductResponse[]>);
    mockedAPI.deleteProduct.mockRejectedValueOnce(({
      response: {
        status: 500,
      },
    } as unknown) as AxiosError);

    renderWithProvider(<BasketProducts />, {
      withSnackbar: true,
    });

    const table = await screen.findByRole('table', { name: 'Product basket' });

    expect(within(table).getAllByRole('row')).toHaveLength(2);

    userEvent.click(
      within(within(table).getAllByRole('row')[0]).getByRole('button', {
        name: 'Remove product',
      }),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Product cannot be removed right now',
    );

    expect(within(table).getAllByRole('row')).toHaveLength(2);
  });
});
