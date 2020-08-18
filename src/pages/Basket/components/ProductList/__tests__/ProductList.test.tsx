import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosPromise } from 'axios';
import React from 'react';
import { act, screen, waitFor, within } from '@testing-library/react';
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
      withDragAndDrop: true,
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
        withDragAndDrop: true,
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
        withDragAndDrop: true,
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
        withDragAndDrop: true,
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
        withDragAndDrop: true,
      });

      expect(await screen.findAllByRole('listitem')).toHaveLength(3);

      expect(
        screen.queryByRole('button', { name: 'Delete product' }),
      ).toBeNull();
    });
  });

  describe('add product dialog', () => {
    let file: File;

    beforeEach(() => {
      mockedAPI.me.mockResolvedValueOnce(({
        data: MeResponseFactory.build({
          isAdmin: true,
        }),
      } as unknown) as AxiosPromise<MeResponse>);
      mockedAPI.products.mockResolvedValueOnce(({
        data: ProductResponseFactory.buildList(2),
      } as unknown) as AxiosPromise<ProductResponse[]>);

      file = new File(['hello'], 'hello.png', { type: 'image/png' });
    });

    it('should close add product dialog', async () => {
      renderWithProvider(<ProductList />, {
        withSnackbar: true,
        withDragAndDrop: true,
      });

      expect(screen.queryByRole('dialog')).toBeNull();

      await act(async () =>
        userEvent.click(
          await screen.findByRole('button', { name: 'Add product' }),
        ),
      );

      await waitFor(() =>
        expect(
          screen.getByRole('dialog', { name: 'Add new product' }),
        ).toBeVisible(),
      );

      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Close' }));
      });

      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('should successfully add new product', async () => {
      mockedAPI.createProduct.mockResolvedValueOnce(({
        data: ProductResponseFactory.build(),
      } as unknown) as AxiosPromise<ProductResponse>);

      renderWithProvider(<ProductList />, {
        withSnackbar: true,
        withDragAndDrop: true,
      });

      await waitFor(() =>
        expect(screen.queryAllByRole('listitem').length).toEqual(2),
      );

      await act(async () =>
        userEvent.click(screen.getByRole('button', { name: 'Add product' })),
      );

      const dialog = await screen.findByRole('dialog', {
        name: 'Add new product',
      });
      const dialogContent = within(dialog);

      expect(dialog).toBeVisible();

      await act(async () => {
        await userEvent.type(
          dialogContent.getByLabelText('Name'),
          'New product',
        );

        await userEvent.type(dialogContent.getByLabelText('Price'), '29.99');

        await userEvent.upload(dialogContent.getByLabelText('Image'), file);

        userEvent.click(dialogContent.getByRole('button', { name: 'Add' }));
      });

      await waitFor(() =>
        expect(screen.queryAllByRole('listitem').length).toEqual(3),
      );

      expect(screen.queryByRole('dialog')).toBeNull();

      expect(mockedAPI.createProduct).toHaveBeenCalledTimes(1);
      expect(mockedAPI.createProduct).toHaveBeenCalledWith({
        name: 'New product',
        price: 29.99,
        image: 'data:image/png;base64,aGVsbG8=',
      });
    });

    it('should fail to add new product', async () => {
      mockedAPI.createProduct.mockRejectedValueOnce(({
        response: {
          status: 400,
          data: {
            image: ['Invalid image format'],
          },
        },
      } as unknown) as AxiosError);

      renderWithProvider(<ProductList />, {
        withSnackbar: true,
        withDragAndDrop: true,
      });

      await act(async () =>
        userEvent.click(
          await screen.findByRole('button', { name: 'Add product' }),
        ),
      );

      const dialog = await screen.findByRole('dialog', {
        name: 'Add new product',
      });
      const dialogContent = within(dialog);

      expect(dialog).toBeVisible();

      await act(async () => {
        await userEvent.type(
          dialogContent.getByLabelText('Name'),
          'New product',
        );

        await userEvent.type(dialogContent.getByLabelText('Price'), '29.99');

        await userEvent.upload(dialogContent.getByLabelText('Image'), file);

        userEvent.click(dialogContent.getByRole('button', { name: 'Add' }));
      });

      await waitFor(() =>
        expect(mockedAPI.createProduct).toHaveBeenCalledTimes(1),
      );

      expect(dialog).toBeVisible();

      expect(dialogContent.getByText('Invalid image format')).toBeTruthy();

      expect(dialogContent.getByRole('button', { name: 'Add' })).toBeEnabled();
    });
  });
});
