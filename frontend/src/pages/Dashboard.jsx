import React, { useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Navigate } from 'react-router-dom';
import { apiCall } from '../utils/Helper';

import LogoutButton from '../components/LogoutButton';
import Presentations from '../components/Presentations';
import { StoreContext } from '../components/StoreProvider';

import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard () {
  const token = localStorage.getItem('token');
  if (token === null) {
    return <Navigate to="/login" />
  }

  const { store, setStore } = useContext(StoreContext);

  React.useEffect(() => {
    apiCall('/store', 'GET', null, token).then((data) => {
      if (!store.presentations || !store) {
        setStore(data.store);
      }
      console.log(data.store);
      console.log(store)
    });
  }, []);

  // show the new presentation modal
  const [showModal, setShowModal] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [titleError, setTitleError] = React.useState(false);
  // Add isClosing state
  const [isClosing, setIsClosing] = React.useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTitleError(false);
    setTimeout(() => {
      setNewTitle('');
      setShowModal(false);
      setIsClosing(false);
    }, 700);
  };

  // Add new presentation to changes array
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newTitle === '') {
      setTitleError(true);
      return;
    }
    const newPresentation = {
      id: Date.now(),
      thumbnail: null,
      title: newTitle,
      slides: [{ id: Date.now(), elements: [] }], // elements: [] {id.., type:..., content.., size:{width:..., height:...}, position: {x:..., y:..., z:...}}
    };
    setNewTitle('');
    setShowModal(false);
    setStore({ presentations: [...(store.presentations || []), newPresentation] });
    console.log([...(store.presentations || []), newPresentation]);
  };

  return (
    <>
    <Container>
    <Header>
      <div>
        <StyledHeading>Dashboard</StyledHeading>
        <div className='mb-3'>
          <StyledButton data-testid="addNew" onClick={handleOpenModal}>New Presentation</StyledButton>
          <LogoutButton />
        </div>
      </div>
    </Header>
      <div className="row">
        <div className="col-12">
          <Presentations userPresentations={store.presentations} store={store} />
        </div>
      </div>
      {showModal && (
      <StyledModal $isclosing={isClosing} className="modal show" tabIndex="-1">
        <StyledModalDialog className="modal-dialog">
          <StyledModalContent className="modal-content">
            <StyledModalHeader className="modal-header">
              <StyledModalTitle className="modal-title">New Presentation</StyledModalTitle>
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
                    data-testid="title"
                  />
                </StyledFormGroup>
                <StyledSubmitButton data-testid="submit" >Submit</StyledSubmitButton>
              </StyledForm>
            </StyledModalBody>
          </StyledModalContent>
        </StyledModalDialog>
      </StyledModal>
      )}
    </Container>
    </>
  );
}

export default Dashboard;

// *******************************************************

// STYLES

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
  color: red;
  margin-top: 5px;
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  background: linear-gradient(to right, #74ebd5, #acb6e5);
  color: black;
  padding-left: 25px;
  margin-left: 10px;
  margin-right: 10px;
  border-bottom: 1px solid rgb(0, 225, 255);
  border-radius: 10px;
`;

const Container = styled.div`
  background-color: white;
  padding: 15px;
`;

const StyledHeading = styled.h1`
  font-family: -apple-sytem, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 3.2rem;
  color: black;
  margin: 1.5rem 0;
  display: inline-block;
  margin-right: 3rem;
`;

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
  margin-right: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .5rem;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;
