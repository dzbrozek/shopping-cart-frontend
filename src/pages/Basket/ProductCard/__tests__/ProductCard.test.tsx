import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { ProductCardProps } from '../types';
import ProductCard from '../ProductCard';

describe('<ProductCard />', () => {
  let props: ProductCardProps;

  beforeEach(() => {
    props = {
      image: 'https://test.com/hose.png',
      name: 'Garden Hose',
      price: 12.35,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component', () => {
    render(<ProductCard {...props} />);

    expect(screen.getByText('Garden Hose')).toBeTruthy();

    expect(screen.getByText('$12.35')).toBeTruthy();

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Garden Hose');
  });

  it('should render delete product button', () => {
    render(<ProductCard {...props} onDelete={jest.fn()} />);

    expect(
      screen.getByRole('button', { name: /Delete product/i }),
    ).toBeTruthy();
  });

  it("shouldn't render delete product button", () => {
    render(<ProductCard {...props} />);

    expect(
      screen.queryByRole('button', { name: /Delete product/i }),
    ).toBeFalsy();
  });

  it('should handle delete product', async () => {
    const onDelete = jest.fn();
    render(<ProductCard {...props} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /Delete product/i }));

    await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1));
  });
});
