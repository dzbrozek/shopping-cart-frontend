import React from 'react';
import { render, screen } from '@testing-library/react';

import NavBar from '../NavBar';

describe('<NavBar />', () => {
  it('should render component', () => {
    render(<NavBar />);

    expect(screen.getByText('Shopping Cart')).toBeTruthy();
  });
});
