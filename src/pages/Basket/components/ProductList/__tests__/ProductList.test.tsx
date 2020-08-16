import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosPromise } from 'axios';
import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import { cache } from 'swr';

import { MeResponse, ProductResponse } from 'api/types';
import { MeResponseFactory, ProductResponseFactory } from 'factories/api';
import API from 'api';
import { renderWithProvider } from 'utils/render';

import ProductList from '../ProductList';

jest.mock('api');

const mockedAPI = API as jest.Mocked<typeof API>;

describe('<ProductList />', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  it('should render component', async () => {
    renderWithProvider(<ProductList />, {
      withSnackbar: true,
    });

    expect(await screen.findByText('Products')).toBeTruthy();
  });

  it('should render empty list of products', async () => {
    mockedAPI.products.mockResolvedValueOnce(({
      data: ProductResponseFactory.buildList(0),
    } as unknown) as AxiosPromise<ProductResponse[]>);

    renderWithProvider(<ProductList />, {
      withSnackbar: true,
    });

    expect(await screen.findByText('No product to display')).toBeTruthy();
  });

  it('should render list of products', async () => {
    mockedAPI.products.mockResolvedValueOnce(({
      data: ProductResponseFactory.buildList(3),
    } as unknown) as AxiosPromise<ProductResponse[]>);

    renderWithProvider(<ProductList />, {
      withSnackbar: true,
    });

    expect(await screen.findAllByRole('listitem')).toHaveLength(3);
  });

  it('should fail to load products', async () => {
    mockedAPI.products.mockRejectedValueOnce(({
      response: {
        status: 500,
      },
    } as unknown) as AxiosError);

    renderWithProvider(<ProductList />, {
      withSnackbar: true,
    });

    expect(await screen.findByText(/Unable to load products/)).toBeTruthy();
  });

  it('should render add product button for admin', async () => {
    mockedAPI.me.mockResolvedValueOnce(({
      data: MeResponseFactory.build({
        isAdmin: true,
      }),
    } as unknown) as AxiosPromise<MeResponse>);

    renderWithProvider(<ProductList />, {
      withSnackbar: true,
    });

    expect(
      await screen.findByRole('button', { name: 'Add product' }),
    ).toBeTruthy();
  });

  it("shouldn't render add product button for non-admin", async () => {
    mockedAPI.me.mockResolvedValueOnce(({
      data: MeResponseFactory.build({
        isAdmin: false,
      }),
    } as unknown) as AxiosPromise<MeResponse>);

    renderWithProvider(<ProductList />, {
      withSnackbar: true,
    });

    await waitFor(() => expect(mockedAPI.me).toHaveBeenCalledTimes(1));

    expect(screen.queryByRole('button', { name: 'Add product' })).toBeNull();
  });

  it("shouldn't render add product button for not authenticated user", async () => {
    mockedAPI.me.mockRejectedValueOnce(({
      response: {
        status: 403,
      },
    } as unknown) as AxiosError);

    renderWithProvider(<ProductList />, {
      withSnackbar: true,
    });

    await waitFor(() => expect(mockedAPI.me).toHaveBeenCalledTimes(1));

    expect(screen.queryByRole('button', { name: 'Add product' })).toBeNull();
  });

  describe('remove product', () => {
    let products: ProductResponse[];

    beforeEach(() => {
      products = ProductResponseFactory.buildList(3);
      mockedAPI.products.mockResolvedValueOnce(({
        data: products,
      } as unknown) as AxiosPromise<ProductResponse[]>);
    });

    it('should successfully remove product by admin', async () => {
      mockedAPI.me.mockResolvedValueOnce(({
        data: MeResponseFactory.build({
          isAdmin: true,
        }),
      } as unknown) as AxiosPromise<MeResponse>);
      mockedAPI.deleteProduct.mockResolvedValueOnce(({
        data: '',
      } as unknown) as AxiosPromise);

      renderWithProvider(<ProductList />, {
        withSnackbar: true,
      });

      const cards = await screen.findAllByRole('listitem');

      expect(cards).toHaveLength(3);

      userEvent.click(
        within(cards[1]).getByRole('button', { name: 'Delete product' }),
      );

      await waitFor(() =>
        expect(screen.getAllByRole('listitem')).toHaveLength(2),
      );

      expect(mockedAPI.deleteProduct).toHaveBeenCalledTimes(1);
      expect(mockedAPI.deleteProduct).toHaveBeenCalledWith(products[1].uuid);
    });

    it('should fail to remove product by admin', async () => {
      mockedAPI.me.mockResolvedValueOnce(({
        data: MeResponseFactory.build({
          isAdmin: true,
        }),
      } as unknown) as AxiosPromise<MeResponse>);
      mockedAPI.deleteProduct.mockRejectedValueOnce(({
        response: {
          status: 404,
        },
      } as unknown) as AxiosPromise);

      renderWithProvider(<ProductList />, {
        withSnackbar: true,
      });

      const cards = await screen.findAllByRole('listitem');

      expect(cards).toHaveLength(3);

      userEvent.click(
        within(cards[1]).getByRole('button', { name: 'Delete product' }),
      );

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'Product cannot be deleted right now',
      );

      await waitFor(() =>
        expect(screen.getAllByRole('listitem')).toHaveLength(3),
      );
    });

    it("shouldn't show remove button to non-admin", async () => {
      mockedAPI.me.mockResolvedValueOnce(({
        data: MeResponseFactory.build({
          isAdmin: false,
        }),
      } as unknown) as AxiosPromise<MeResponse>);

      renderWithProvider(<ProductList />, {
        withSnackbar: true,
      });

      expect(await screen.findAllByRole('listitem')).toHaveLength(3);

      expect(
        screen.queryByRole('button', { name: 'Delete product' }),
      ).toBeNull();
    });

    it("shouldn't show remove button to not authenticated user", async () => {
      mockedAPI.me.mockRejectedValueOnce(({
        response: {
          status: 403,
        },
      } as unknown) as AxiosError);

      renderWithProvider(<ProductList />, {
        withSnackbar: true,
      });

      expect(await screen.findAllByRole('listitem')).toHaveLength(3);

      expect(
        screen.queryByRole('button', { name: 'Delete product' }),
      ).toBeNull();
    });
  });
});
