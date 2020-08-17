import React from 'react';
import { screen } from '@testing-library/react';

import { renderWithProvider } from 'utils/render';

import LoginDialog from '../LoginDialog';

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
});
