import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProvider } from 'utils/render';

import AddProductDialog, { schema } from '../AddProductDialog';

describe('<AddProductDialog />', () => {
  it('should render component', () => {
    renderWithProvider(<AddProductDialog open onClose={jest.fn()} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Add new product');

    const nameField = screen.getByLabelText('Name');

    expect(nameField).toHaveValue('');

    const priceField = screen.getByLabelText('Price');

    expect(priceField).toHaveValue('');

    const imageField = screen.getByLabelText('Image');

    expect(imageField).toHaveValue('');

    expect(screen.getByRole('button', { name: 'Close' })).toBeEnabled();

    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
  });

  describe('schema', () => {
    it('it should accept valid data', () => {
      expect(
        schema.isValidSync({
          name: 'Test product',
          price: '299.99',
          image: [new File(['hello'], 'hello.png', { type: 'image/png' })],
        }),
      ).toBeTruthy();
    });

    it('should reject missing data', () => {
      try {
        expect(
          schema.validateSync(
            {
              name: '',
              price: '',
              image: [],
            },
            {
              abortEarly: false,
            },
          ),
        );
      } catch (e) {
        expect(e.errors).toEqual([
          'Please provide name',
          'Please provide valid number',
          'Please select image',
        ]);
      }
    });
  });
});
