import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../pages/Login';
import { act } from 'react-dom/test-utils';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock('../utils/Helper', () => ({
  apiCall: jest.fn(),
}));

describe('Password and Email input fields', () => {
  it('displays an error message for invalid/empty inputs', async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/Enter your email here/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password here/i);
    await act(async () => {
      userEvent.type(emailInput, '1');
    });
    expect(emailInput).toHaveValue('1');
    await act(async () => {
        userEvent.tab();
      });
    expect(screen.getByText(/Invalid Email !!! Please enter again/i)).toBeInTheDocument();
    await act(async () => {
      userEvent.clear(emailInput);
    });
    expect(emailInput).toHaveValue('');
    await act(async () => {
      userEvent.tab();
    });
    expect(screen.getByText(/Email is required !!!/i)).toBeInTheDocument();
    await act(async () => {
      userEvent.type(passwordInput, '1');
    });
    expect(passwordInput).toHaveValue('1');
    expect(screen.queryByText(/Password is required !!!/i)).toBeNull();
    await act(async () => {
      userEvent.tab();
    });
    await act(async () => {
      userEvent.clear(passwordInput);
    });
    await act(async () => {
      userEvent.tab();
    });
    expect(passwordInput).toHaveValue('');
    expect(screen.getByText(/Password is required !!!/i)).toBeInTheDocument();
  });

  it('enter inputs for email and password ', async () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText(/Enter your email here/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password here/i);
  
    await act(async () => {
      userEvent.type(emailInput, 'a');
      userEvent.type(emailInput, '@');
      userEvent.type(emailInput, 'x');
      userEvent.type(emailInput, '.');
      userEvent.type(emailInput, 'x');
    });
    await act(async () => {
      userEvent.type(passwordInput, 'a');
      userEvent.type(passwordInput, 'f');
    });
    expect(screen.queryByText(/Email is required !!!/i)).toBeNull();
    expect(screen.queryByText(/af/i)).toBeNull(); // password should not be visible
  });
});