import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/Helper';
import { StoreContext } from './StoreProvider';

const StyledButton = styled.button`
  display: inline-block;
  margin-bottom: 1rem;
  background-color: #8b3dff;
  border-color: #007bff;
  color: white;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .5rem;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

function Logout () {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const { store, setStore, resetStore } = useContext(StoreContext);

  const navigate = useNavigate();

  const syncChanges = () => {
    const updatedStore = { presentations: store.presentations };
    apiCall('/store', 'PUT', { store: updatedStore }, token)
      .then((data) => {
        console.log('Synced with server:', data);
        setStore({});
      });
  };
  const handleLogout = async (event) => {
    event.preventDefault();
    syncChanges();

    const data = await apiCall('/admin/auth/logout', 'POST', { email }, token);
    if (data) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      resetStore();
      setToken('');
      setEmail('');
      navigate('/login');
    } else {
      console.log('Logout failed');
    }
  }

  return (
    <StyledButton data-testid="logout" onClick={handleLogout}>Logout</StyledButton>
  );
}

export default Logout;
