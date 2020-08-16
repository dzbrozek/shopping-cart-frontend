import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { ProductResponseFactory } from 'factories/api';
import { renderWithProvider } from 'utils/render';

import { ProductCardProps } from '../types';
import ProductCard from '../ProductCard';

describe('<ProductCard />', () => {
  let props: ProductCardProps;

  beforeEach(() => {
    props = {
      product: ProductResponseFactory.build({
        image: 'https://test.com/hose.png',
        name: 'Garden Hose',
        price: '12.35',
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    renderWithProvider(<ProductCard {...props} />, {
      withDragAndDrop: true,
    });

    expect(screen.getByText('Garden Hose')).toBeTruthy();

    expect(screen.getByText('$12.35')).toBeTruthy();

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Garden Hose');
  });

  it('should render delete product button', () => {
    renderWithProvider(<ProductCard {...props} onDelete={jest.fn()} />, {
      withDragAndDrop: true,
    });

    expect(
      screen.getByRole('button', { name: /Delete product/i }),
    ).toBeTruthy();
  });

  it("shouldn't render delete product button", () => {
    renderWithProvider(<ProductCard {...props} />, {
      withDragAndDrop: true,
    });

    expect(
      screen.queryByRole('button', { name: /Delete product/i }),
    ).toBeFalsy();
  });

  it('should handle delete product', async () => {
    const onDelete = jest.fn();
    renderWithProvider(<ProductCard {...props} onDelete={onDelete} />, {
      withDragAndDrop: true,
    });

    fireEvent.click(screen.getByRole('button', { name: /Delete product/i }));

    await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1));
  });
});
