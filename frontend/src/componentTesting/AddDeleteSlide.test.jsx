import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditPresentation from '../pages/EditPresentation';
import { StoreContext } from '../components/StoreProvider';
import Router from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../utils/Helper', () => ({
  apiCall: jest.fn().mockResolvedValue({ success: true }),
}));

describe('Delete Presentation Button', () => {
  it('renders and work', async () => {
    // Mock the window.location.href value
    delete window.location;
    window.location = new URL('http://localhost/presentation/1/edit');
    // Create a mock store
    const mockStore = {
      store: {
        presentations: [
          {
            id: 1,
            thumbnail: null,
            title: "1",
            slides: [
              {
                id: 1,
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
        <EditPresentation />
      </StoreContext.Provider>
    );

    // find add and delete buttons
    const addSlideBtn = screen.getByRole('button', { name: /Add Slide/i });
    expect(addSlideBtn).toBeInTheDocument();
    const deleteSlideBtn = screen.getByRole('button', { name: /Delete Slide/i });
    expect(deleteSlideBtn).toBeInTheDocument();

    // click addSlide button and expect setStore be called
    fireEvent.click(addSlideBtn);
    expect(mockStore.setStore).toHaveBeenCalledTimes(1);

    // click deleteSlide button and expect prompt delete presentation on second click
    userEvent.click(deleteSlideBtn);
    userEvent.click(deleteSlideBtn);
    expect(screen.getByText(/Cannot delete the only slide !!! Please delete the presentation instead./i)).toBeInTheDocument();
  });
});