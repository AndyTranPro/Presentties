import React, { useState, useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StoreContext } from './StoreProvider';

function DeletePresentation ({ presentationId }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  // Add isClosing state for the modal
  const [isClosing, setIsClosing] = React.useState(false);
  const { store, setStore } = useContext(StoreContext);

  const handleOnClick = () => {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 700);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setShowModal(false);
    const updatedStore = { presentations: store.presentations.filter(p => Number(p.id) !== Number(presentationId)) }
    setStore(updatedStore);
    navigate('/dashboard');
  }

  return (
    <>
    <StyledDeleteButton data-testid="delpresentation" variant="outline-info" onClick={handleOnClick}>Delete Presentation</StyledDeleteButton>
    {showModal && (
      <StyledModal $isclosing={isClosing} className="modal show" tabIndex="-1">
        <StyledModalDialog className="modal-dialog">
          <StyledModalContent className="modal-content">
            <StyledModalHeader className="modal-header">
              <StyledModalTitle className="modal-title">Are you sure?</StyledModalTitle>
              <StyledCloseButton onClick={handleCloseModal}>
                <span>&times;</span>
              </StyledCloseButton>
            </StyledModalHeader>
            <StyledModalBody className="modal-body">
              <StyledSubmitButton data-testid="confirmdel" onClick={handleFormSubmit}>Yes</StyledSubmitButton>
              <StyledCloseButton onClick={handleCloseModal}>No</StyledCloseButton>
            </StyledModalBody>
          </StyledModalContent>
        </StyledModalDialog>
      </StyledModal>
    )}
    </>
  );
}

export default DeletePresentation;

// Define the keyframes
const dropDown = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(0); }
`;

const reverseDropDown = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
`;

const StyledModal = styled.div`
  display: block;
  animation: ${props => props.$isclosing ? css`${reverseDropDown} 0.7s ease-in-out forwards` : css`${dropDown} 0.7s ease-in-out forwards`};
`;

const StyledModalDialog = styled.div``;

const StyledModalContent = styled.div``;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border: none;
`;

const StyledModalTitle = styled.h5``;

const StyledCloseButton = styled.button`
  display: inline-block;
  background-color: red;
  border-color: #007bff;
  color: white;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  margin-right: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .5rem;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledModalBody = styled.div``;

const StyledDeleteButton = styled(Button)`
  margin-left: 10px;
`;

const StyledSubmitButton = styled.button`
  display: inline-block;
  background-color: #8b3dff;
  border-color: #007bff;
  color: white;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  margin-right: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .5rem;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;
