import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { renderWithProvider } from 'utils/render';

import BasketRow from '../BasketRow';
import { BasketRowProps } from '../types';

describe('<BasketRow />', () => {
  let props: BasketRowProps;

  beforeEach(() => {
    props = {
      image: 'https://test.com/hose.png',
      name: 'Garden Hose',
      quantity: 2,
      price: 12.35,
      onDelete: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderWithProvider(
      <table>
        <tbody>
          <BasketRow {...props} />
        </tbody>
      </table>,
    );

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Garden Hose');

    expect(screen.getByText('Garden Hose')).toBeTruthy();

    expect(screen.getByText('$24.7')).toBeTruthy();

    expect(
      screen.getByRole('button', { name: /Remove product/i }),
    ).toBeTruthy();
  });

  it('should handle remove product', async () => {
    renderWithProvider(
      <table>
        <tbody>
          <BasketRow {...props} />
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Remove product/i }));

    await waitFor(() => expect(props.onDelete).toHaveBeenCalledTimes(1));
  });
});
