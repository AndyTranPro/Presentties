import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditThumbnailButton from '../components/EditThumbnailButton';
import { StoreContext } from '../components/StoreProvider';
import Router from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../utils/Helper', () => ({
  apiCall: jest.fn().mockResolvedValue({ success: true }),
}));

describe('Thumbnail Button', () => {
  it('renders and work', async () => {
    // Create a mock store
    const mockStore = {
      store: {
        presentations: [
          {
            id: 1713501298131,
            thumbnail: null,
            title: "1",
            slides: [
              {
                id: 1713501298131,
                elements: []
              }
            ]
          }
        ]
      },
      setStore: jest.fn(),
    };

    render(
      <StoreContext.Provider value={mockStore}>
        <EditThumbnailButton />
      </StoreContext.Provider>
    );

    const editButton = screen.getByRole('button', { name: /Edit Thumbnail/i });
    expect(editButton).toBeInTheDocument();
    userEvent.click(editButton);

    expect(screen.getByText(/Edit Thumbnail/i)).toBeInTheDocument();
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);
    // show error message
    expect(screen.getByText(/Thumbnail image is required !!!/i)).toBeInTheDocument();
    
    const closeButton = screen.getByTestId("thumbnailclsbtn");
    expect(closeButton).toBeInTheDocument();
    // Submit the form
    userEvent.click(closeButton);

    // Error message should be gone
    const errorMessage = screen.queryByText('Thumbnail image is required !!!');
    expect(errorMessage).toBeNull();

    //Model should close
    const modelTitle = screen.queryByText('New Thumbnail');
    expect(errorMessage).toBeNull();
  });
});