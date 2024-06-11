import React, { useState, useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { StoreContext } from './StoreProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditPresentationTitle ({ presentationId }) {
  const [showModal, setShowModal] = useState(false);
  // Add isClosing state for the modal
  const [isClosing, setIsClosing] = React.useState(false);
  const [titleError, setTitleError] = React.useState(false);
  const { store, setStore } = useContext(StoreContext);
  const [newTitle, setNewTitle] = useState('');
  const presentations = store.presentations;
  const presentation = presentations.find(p => Number(p.id) === Number(presentationId))
  const handleCloseModal = () => {
    setIsClosing(true);
    setTitleError(false);
    setTimeout(() => {
      setNewTitle('');
      setShowModal(false);
      setIsClosing(false);
    }, 700);
  }
  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (newTitle === '') {
      setTitleError(true);
      return;
    }
    // hide the modal
    setShowModal(false);
    // update the title of the targeted presentation in the local store
    const newPresentation = presentation;
    newPresentation.title = newTitle;
    const updatedStore = { presentations: store.presentations.map(p => Number(p.id) === Number(presentationId) ? newPresentation : p) };
    setStore(updatedStore);
    setNewTitle('');
  }

  return (
    <>
      <FontAwesomeIcon data-testid="editbtn" onClick={handleOpenModal} icon={faEdit}></FontAwesomeIcon>
      {showModal && (
      <StyledModal $isclosing={isClosing} className="modal show" tabIndex="-1">
        <StyledModalDialog className="modal-dialog">
          <StyledModalContent className="modal-content">
            <StyledModalHeader className="modal-header">
              <StyledModalTitle className="modal-title">New Title</StyledModalTitle>
              <StyledCloseButton onClick={handleCloseModal}>
                <span>&times;</span>
              </StyledCloseButton>
            </StyledModalHeader>
            <StyledModalBody className="modal-body">
              <StyledForm onSubmit={handleFormSubmit}>
                <StyledFormGroup className="form-group">
                {titleError && <ErrorMessage>Title is required !!!</ErrorMessage>}
                  <StyledInput
                    type="text"
                    className="form-control"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter title"
                    data-testid="editTitleInput"
                  />
                </StyledFormGroup>
                <StyledSubmitButton data-testid="submitNewTitle" >Submit</StyledSubmitButton>
              </StyledForm>
            </StyledModalBody>
          </StyledModalContent>
        </StyledModalDialog>
      </StyledModal>
      )}
    </>
  );
}

export default EditPresentationTitle;

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
  font-size: 1.2rem;
  line-height: 1.3;
  border-radius: .3rem;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledModalBody = styled.div``;

const StyledForm = styled.form``;

const StyledFormGroup = styled.div``;

const ErrorMessage = styled.div`
  font-size: 1rem;
  color: red;
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  margin-bottom: 1rem;
  width: 100%;
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
