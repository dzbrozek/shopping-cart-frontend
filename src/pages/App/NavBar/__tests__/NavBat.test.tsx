import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosPromise } from 'axios';
import React from 'react';
import { screen, act, waitFor, within } from '@testing-library/react';
import { cache } from 'swr';

import { MeResponseFactory } from 'factories/api';
import { MeResponse } from 'api/types';
import API from 'api';
import { renderWithProvider } from 'utils/render';

import NavBar from '../NavBar';

jest.mock('api');

const mockedAPI = API as jest.Mocked<typeof API>;

describe('<NavBar />', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  it('should render component', async () => {
    await act(async () => {
      renderWithProvider(<NavBar />, {
        withSnackbar: true,
      });
    });

    expect(screen.getByText('Shopping Cart')).toBeTruthy();
  });

  it('should render component for authenticated user', async () => {
    mockedAPI.me.mockResolvedValueOnce(({
      data: MeResponseFactory.build(),
    } as unknown) as AxiosPromise<MeResponse>);

    renderWithProvider(<NavBar />, {
      withSnackbar: true,
    });

    expect(
      await screen.findByRole('button', { name: 'account of current user' }),
    ).toBeTruthy();
  });

  it('should render component for unauthenticated user', async () => {
    mockedAPI.me.mockRejectedValueOnce(({
      response: {
        status: 403,
      },
    } as unknown) as AxiosError);

    renderWithProvider(<NavBar />, {
      withSnackbar: true,
    });

    expect(await screen.findByRole('button', { name: 'Login' })).toBeTruthy();
  });

  it('should successfully logout', async () => {
    mockedAPI.me.mockResolvedValueOnce(({
      data: MeResponseFactory.build(),
    } as unknown) as AxiosPromise<MeResponse>);
    mockedAPI.logOut.mockResolvedValueOnce(({
      data: '',
    } as unknown) as AxiosPromise<string>);

    renderWithProvider(<NavBar />, {
      withSnackbar: true,
    });

    await act(async () =>
      userEvent.click(
        await screen.findByRole('button', { name: 'account of current user' }),
      ),
    );

    await act(async () =>
      userEvent.click(await screen.findByRole('menuitem', { name: 'Log out' })),
    );

    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'account of current user' }),
      ).toBeNull(),
    );

    expect(await screen.findByRole('button', { name: 'Login' })).toBeTruthy();
  });

  it('should fail to logout', async () => {
    mockedAPI.me.mockResolvedValueOnce(({
      data: MeResponseFactory.build(),
    } as unknown) as AxiosPromise<MeResponse>);
    mockedAPI.logOut.mockRejectedValueOnce(({
      response: {
        status: 500,
      },
    } as unknown) as AxiosError);

    renderWithProvider(<NavBar />, {
      withSnackbar: true,
    });

    await act(async () =>
      userEvent.click(
        await screen.findByRole('button', { name: 'account of current user' }),
      ),
    );

    await act(async () =>
      userEvent.click(await screen.findByRole('menuitem', { name: 'Log out' })),
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'You cannot log out right now',
    );

    expect(
      await screen.findByRole('button', { name: 'account of current user' }),
    ).toBeTruthy();
  });

  describe('login dialog', () => {
    beforeEach(() => {
      mockedAPI.me.mockRejectedValueOnce(({
        response: {
          status: 403,
        },
      } as unknown) as AxiosPromise<MeResponse>);
    });

    it('should close login dialog', async () => {
      renderWithProvider(<NavBar />, {
        withSnackbar: true,
      });

      expect(screen.queryByRole('dialog')).toBeNull();

      userEvent.click(await screen.findByRole('button', { name: 'Login' }));

      await waitFor(() =>
        expect(screen.getByRole('dialog', { name: 'Login' })).toBeVisible(),
      );

      await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Close' }));
      });

      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('should successfully login', async () => {
      mockedAPI.login.mockResolvedValueOnce(({
        data: MeResponseFactory.build(),
      } as unknown) as AxiosPromise<MeResponse>);
      renderWithProvider(<NavBar />, {
        withSnackbar: true,
      });

      userEvent.click(await screen.findByRole('button', { name: 'Login' }));

      const dialog = screen.getByRole('dialog', { name: 'Login' });
      const dialogContent = within(dialog);

      await waitFor(() => expect(dialog).toBeVisible());

      await act(async () => {
        await userEvent.type(
          dialogContent.getByLabelText('Email'),
          'test@email.com',
        );

        await userEvent.type(
          dialogContent.getByLabelText('Password'),
          'password',
        );

        userEvent.click(dialogContent.getByRole('button', { name: 'Login' }));
      });

      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

      expect(screen.queryByRole('button', { name: 'Login' })).toBeNull();

      expect(
        await screen.findByRole('button', { name: 'account of current user' }),
      ).toBeTruthy();

      expect(mockedAPI.login).toHaveBeenCalledTimes(1);
      expect(mockedAPI.login).toHaveBeenCalledWith({
        email: 'test@email.com',
        password: 'password',
      });
    });

    it('should fail to login', async () => {
      mockedAPI.login.mockRejectedValueOnce(({
        response: {
          status: 400,
          data: ['Invalid credentials'],
        },
      } as unknown) as AxiosError);
      renderWithProvider(<NavBar />, {
        withSnackbar: true,
      });

      userEvent.click(await screen.findByRole('button', { name: 'Login' }));

      const dialog = screen.getByRole('dialog', { name: 'Login' });
      const dialogContent = within(dialog);

      await waitFor(() => expect(dialog).toBeVisible());

      await act(async () => {
        await userEvent.type(
          dialogContent.getByLabelText('Email'),
          'test@email.com',
        );

        await userEvent.type(
          dialogContent.getByLabelText('Password'),
          'password',
        );

        userEvent.click(dialogContent.getByRole('button', { name: 'Login' }));
      });

      await waitFor(() => expect(mockedAPI.login).toHaveBeenCalledTimes(1));

      expect(screen.getByRole('dialog', { name: 'Login' })).toBeVisible();

      expect(
        dialogContent.getByRole('button', { name: 'Login' }),
      ).toBeEnabled();

      expect(dialogContent.getByText('Invalid credentials')).toBeTruthy();
    });
  });
});
