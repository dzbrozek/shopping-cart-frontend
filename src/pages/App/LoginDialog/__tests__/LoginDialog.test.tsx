import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProvider } from 'utils/render';

import LoginDialog, { schema } from '../LoginDialog';

describe('<LoginDialog />', () => {
  it('should render dialog', () => {
    renderWithProvider(<LoginDialog open onClose={jest.fn()} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Login');

    const emailField = screen.getByLabelText('Email');

    expect(emailField).toHaveValue('');

    const passwordField = screen.getByLabelText('Password');

    expect(passwordField).toHaveValue('');

    expect(screen.getByRole('button', { name: 'Close' })).toBeEnabled();

    expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled();
  });

  describe('schema', () => {
    it('should reject empty values', () => {
      try {
        schema.validateSync(
          {
            email: '',
            password: '',
          },
          {
            abortEarly: false,
          },
        );
      } catch (e) {
        expect(e.errors).toEqual([
          'Please provide email',
          'Please provide password',
        ]);
      }
    });

    it('should reject invalid email', () => {
      try {
        schema.validateSync(
          {
            email: 'email',
            password: 'password',
          },
          {
            abortEarly: false,
          },
        );
      } catch (e) {
        expect(e.errors).toEqual(['Please provide valid email']);
      }
    });

    it('should accept valid values', () => {
      expect(
        schema.isValidSync({
          email: 'test@email.com',
          password: 'password',
        }),
      ).toBeTruthy();
    });
  });
});
