import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import * as Helper from '../utils/Helper';  // Import the module where `apiCall` is defined

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));
jest.mock('../utils/Helper', () => ({
  apiCall: jest.fn().mockResolvedValue({ success: true }),
}));

describe('Submit in Login', () => {
  it('renders the login page and submits the form', async () => {
    render(<Login />);

    // Assuming inputs have placeholders or labels
    const usernameInput = screen.getByPlaceholderText('Enter your email here');
    const passwordInput = screen.getByPlaceholderText('Enter your password here');
    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Fill out the form
    userEvent.type(usernameInput, 'testuser');
    userEvent.type(passwordInput, 'password');

    // Submit the form
    userEvent.click(submitButton);

    // Wait for expected outcome, e.g., navigating away, calling an API, etc.
    await waitFor(() => {
      // Accessing the mock function directly from the mocked module
      expect(Helper.apiCall).toHaveBeenCalledWith("/admin/auth/login", "POST", {"email": "testuser", "password": "password"}, null);
    });
  });
});
