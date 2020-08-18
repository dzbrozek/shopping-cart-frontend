import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProvider } from 'utils/render';

import ShareBasketDialog, { schema } from '../ShareBasketDialog';

describe('<ShareBasketDialog />', () => {
  it('should render component', () => {
    renderWithProvider(<ShareBasketDialog open onClose={jest.fn()} />, {
      withSnackbar: true,
    });

    expect(screen.getByRole('heading')).toHaveTextContent('Share basket');

    const emailField = screen.getByLabelText('Email');

    expect(emailField).toHaveValue('');

    expect(screen.getByRole('button', { name: 'Close' })).toBeEnabled();

    expect(screen.getByRole('button', { name: 'Share' })).toBeEnabled();
  });

  describe('schema', () => {
    it('it should accept valid email', () => {
      expect(
        schema.isValidSync({
          email: 'test@email.com',
        }),
      ).toBeTruthy();
    });

    it('should reject missing email', () => {
      try {
        expect(
          schema.validateSync({
            email: '',
          }),
        );
      } catch (e) {
        expect(e.message).toEqual('Please provide email');
      }
    });

    it('should reject invalid email', () => {
      try {
        expect(
          schema.validateSync({
            email: 'email',
          }),
        );
      } catch (e) {
        expect(e.message).toEqual('Please provide valid email');
      }
    });
  });
});
