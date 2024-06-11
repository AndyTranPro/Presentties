import React, { useState, useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StoreContext } from './StoreProvider';
import { fileToDataUrl } from '../utils/Helper';

const EditThumbnail = ({ presentationId }) => {
  const [showModal, setShowModal] = useState(false);
  // Add isClosing state for the modal
  const [isClosing, setIsClosing] = React.useState(false);
  const [thumbnailError, setThumbnailError] = React.useState(false);
  const { store, setStore } = useContext(StoreContext);
  const [thumbnail, setThumbnail] = useState('');
  const presentations = store.presentations;
  const presentation = presentations.find(p => Number(p.id) === Number(presentationId))

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setIsClosing(true);
    setThumbnailError(false);
    setTimeout(() => {
      setShowModal(false);
      setThumbnail('');
      setIsClosing(false);
    }, 700);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (thumbnail) {
      fileToDataUrl(thumbnail)
        .then(dataUrl => {
          // update the thumbnail of the targeted presentation in the local store
          const newPresentation = presentation;
          newPresentation.thumbnail = dataUrl;
          const updatedStore = { presentations: store.presentations.map(p => Number(p.id) === Number(presentationId) ? newPresentation : p) };
          setStore(updatedStore);
        })
    } else {
      setThumbnailError(true);
      return;
    }
    setShowModal(false);
    setThumbnail('');
  }

  return (
    <>
    <StyledEditThumbnail data-testid="editThumbnail" variant="outline-info" onClick={handleOpenModal}>Edit Thumbnail</StyledEditThumbnail>
    {showModal && (
      <StyledModal $isclosing={isClosing} className="modal show" tabIndex="-1">
        <StyledModalDialog className="modal-dialog">
          <StyledModalContent className="modal-content">
            <StyledModalHeader className="modal-header">
              <StyledModalTitle className="modal-title">New Thumbnail</StyledModalTitle>
              <StyledCloseButton data-testid="thumbnailclsbtn" onClick={handleCloseModal}>
                <span>&times;</span>
              </StyledCloseButton>
            </StyledModalHeader>
            <StyledModalBody className="modal-body">
              <StyledForm onSubmit={handleFormSubmit}>
                <StyledFormGroup className="form-group">
                {thumbnailError && <ErrorMessage>Thumbnail image is required !!!</ErrorMessage>}
                  <StyledInput
                    type="file"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    id="thumbnail-upload"
                    name="thumbnail-upload"
                    accept="image/*"
                    data-testid="thumbnail-upload"
                  />
                </StyledFormGroup>
                <StyledSubmitButton data-test-id="submit" >Submit</StyledSubmitButton>
              </StyledForm>
            </StyledModalBody>
          </StyledModalContent>
        </StyledModalDialog>
      </StyledModal>
    )}
    </>
  );
}

export default EditThumbnail;

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

const StyledEditThumbnail = styled(Button)`
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
