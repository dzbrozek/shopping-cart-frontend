import { AxiosError, AxiosPromise } from 'axios';
import React from 'react';
import { screen, act } from '@testing-library/react';
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
      renderWithProvider(<NavBar />);
    });

    expect(screen.getByText('Shopping Cart')).toBeTruthy();
  });

  it('should render component for authenticated user', async () => {
    mockedAPI.me.mockResolvedValueOnce(({
      data: MeResponseFactory.build(),
    } as unknown) as AxiosPromise<MeResponse>);

    renderWithProvider(<NavBar />);

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

    renderWithProvider(<NavBar />);

    expect(await screen.findByRole('button', { name: 'Login' })).toBeTruthy();
  });
});
