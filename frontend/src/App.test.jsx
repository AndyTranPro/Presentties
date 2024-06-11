import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // App renders Login page by default when no route is matched or token is not present
  const linkElement = screen.getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
