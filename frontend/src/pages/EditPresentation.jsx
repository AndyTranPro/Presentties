import React, { useContext, useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { StoreContext } from '../components/StoreProvider';
import LogoutButton from '../components/LogoutButton';
import DeletePresentation from '../components/DeletePresentationButton';
import EditPresentationTitle from '../components/EditPresentationTitleButton';
import EditThumbnail from '../components/EditThumbnailButton';
import Slide from '../components/Slide';
import { fileToDataUrl } from '../utils/Helper';

function EditPresentation () {
  const navigate = useNavigate();
  const { store, setStore } = useContext(StoreContext);
  const presentations = store.presentations;
  // get the id from the URL
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  const segments = pathname.split('/');
  const id = segments[segments.length - 2];

  // find the presentation with the given id and get its slides
  const presentation = presentations ? presentations.find(p => Number(p.id) === Number(id)) : undefined;
  const [slides, setSlides] = useState(presentation ? presentation.slides : []);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  let currentSlide = slides ? slides[currentSlideIndex] : undefined;

  // Add isClosing state for the modal
  const [isClosing, setIsClosing] = React.useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 700);
  }
  const handleOpenModal = () => {
    setShowModal(true);
  }

  // handle keyboard navigation
  useEffect(() => {
    let isMounted = true;
    const handleKeyDown = (event) => {
      if (isMounted) {
        if (event.key === 'ArrowLeft') {
          setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
        } else if (event.key === 'ArrowRight') {
          setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [slides]);

  // handle the deletion of a slide
  const handleDeleteSlide = (event) => {
    event.preventDefault();
    if (slides.length === 1) {
      handleOpenModal();
      return;
    }
    const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
    // update the slides of the targeted presentation in the local store
    const newPresentation = presentation;
    newPresentation.slides = newSlides;
    const updatedStore = { presentations: store.presentations.map(p => Number(p.id) === Number(id) ? newPresentation : p) };
    setStore(updatedStore);
    setSlides(newSlides);
    if (currentSlideIndex === 0 && newSlides.length > 0) {
      setCurrentSlideIndex(0); // stay on the first slide
    } else {
      setCurrentSlideIndex((prev) => Math.max(prev - 1, 0)); // go to the previous slide
    }
  };

  // Add event listener to handle the addition of a slide
  const handleAddSlide = (event) => {
    event.preventDefault();
    const newSlide = {
      id: Date.now(),
      elements: []
    };
    // update the slides of the targeted presentation in the local store
    const newPresentation = presentation;
    newPresentation.slides.push(newSlide);
    const updatedStore = { presentations: store.presentations.map(p => Number(p.id) === Number(id) ? newPresentation : p) };
    setStore(updatedStore);
    setSlides(newPresentation.slides);
  };
  // TEXT ELEMENT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const [showTextModal, setShowTextModal] = useState(false);
  const elements = currentSlide ? currentSlide.elements : [];
  // use states for elements
  const [newText, setNewText] = useState('');
  const [elementWidth, setElementWidth] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const [elementFontSize, setElementFontSize] = useState(0);
  const [elementFontColor, setElementFontColor] = useState('');
  const [textError, setTextError] = React.useState(false);
  const [invalidHeight, setInvalidHeight] = React.useState(false);
  const [invalidWidth, setInvalidWidth] = React.useState(false);

  const handleWidthChange = (event) => {
    const value = event.target.value;
    setElementWidth(value);
    // Check if the value is within the range 0 to 100
    if (value < 0 || value > 100) {
      setInvalidWidth(true);
    } else {
      setInvalidWidth(false);
    }
  };

  const handleHeightChange = (event) => {
    const value = event.target.value;
    setElementHeight(value);
    // Check if the value is within the range 0 to 100
    if (value < 0 || value > 100) {
      setInvalidHeight(true);
    } else {
      setInvalidHeight(false);
    }
  };

  const handleAddText = (event) => {
    event.preventDefault();
    if (newText === '') {
      setTextError(true);
      return;
    }
    const newTextElement = {
      id: Date.now(),
      type: 'text',
      content: newText,
      fontSize: elementFontSize,
      fontColor: elementFontColor,
      size: { width: elementWidth, height: elementHeight },
      position: { x: 0, y: 0, z: elements.length },
    }
    // update the array of elements
    const updatedElements = elements;
    updatedElements.push(newTextElement);
    // update the current slide
    const updatedSlide = currentSlide;
    updatedSlide.elements = updatedElements;
    currentSlide = updatedSlide;
    const updatedSlides = slides;
    updatedSlides[currentSlideIndex] = updatedSlide;
    setSlides(updatedSlides);
    // update the store
    const newPresentation = presentation;
    newPresentation.slides = updatedSlides;
    const updatedStore = { presentations: store.presentations.map(p => Number(p.id) === Number(id) ? newPresentation : p) };
    setStore(updatedStore);

    // reset all the element inputs
    setNewText('');
    setElementWidth(0);
    setElementHeight(0);
    setInvalidHeight(false);
    setInvalidWidth(false);
    setShowTextModal(false);
  }

  const handleCloseTextModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowTextModal(false);
      setIsClosing(false);
    }, 700);
  }
  const handleOpenTextModal = () => {
    setInvalidHeight(false);
    setInvalidWidth(false);
    setShowTextModal(true);
  }

  // IMAGE ELEMENT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [imageError, setImageError] = React.useState(false);

  const handleCloseImageModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowImageModal(false);
      setIsClosing(false);
    }, 700);
  }
  const handleOpenImageModal = () => {
    setInvalidHeight(false);
    setInvalidWidth(false);
    setImageError(false);
    setShowImageModal(true);
  }

  const handleAddImage = async (event) => {
    event.preventDefault();
    if (imageDescription === '') {
      setImageDescription('No description');
    }
    if (newImage === '' && newImageUrl === '') {
      setImageError(true);
    } else {
      setImageError(false);
      const newImageElement = {
        id: Date.now(),
        type: 'image',
        content: '',
        description: imageDescription,
        size: { width: elementWidth, height: elementHeight },
        position: { x: 0, y: 0, z: elements.length },
      }
      // check if the image is uploaded from the system or from the internet
      if (newImageUrl) {
        newImageElement.content = newImageUrl;
      } else {
        const dataUrl = await fileToDataUrl(newImage);
        newImageElement.content = dataUrl;
      }
      // update the array of elements
      const updatedElements = elements;
      updatedElements.push(newImageElement);
      // update the current slide
      const updatedSlide = currentSlide;
      updatedSlide.elements = updatedElements;
      currentSlide = updatedSlide;
      const updatedSlides = slides;
      updatedSlides[currentSlideIndex] = updatedSlide;
      setSlides(updatedSlides);
      // update the store
      const newPresentation = presentation;
      newPresentation.slides = updatedSlides;
      const updatedStore = { presentations: store.presentations.map(p => Number(p.id) === Number(id) ? newPresentation : p) };
      setStore(updatedStore);
    }
    // reset all the element inputs
    setNewImage('');
    setNewImageUrl('');
    setImageDescription('');
    setElementWidth(0);
    setElementHeight(0);
    setShowImageModal(false);
  }

  // VIDEO ELEMENT ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [videoError, setVideoError] = React.useState(false);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*)/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    } else {
      return null;
    }
  };

  const handleCloseVideoModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowVideoModal(false);
      setIsClosing(false);
    }, 700);
  }
  const handleOpenVideoModal = () => {
    setInvalidHeight(false);
    setInvalidWidth(false);
    setVideoError(false);
    setShowVideoModal(true);
  }

  const handleAddVideo = async (event) => {
    event.preventDefault();
    if (newVideoUrl === '') {
      setVideoError(true);
    } else {
      setVideoError(false);
      const newVideoElement = {
        id: Date.now(),
        type: 'video',
        autoPlay: videoAutoplay,
        content: extractVideoId(newVideoUrl),
        size: { width: elementWidth, height: elementHeight },
        position: { x: 0, y: 0, z: elements.length },
      }
      console.log(`https://www.youtube.com/embed/${newVideoElement.content}${newVideoElement.autoPlay === 'true' ? '?autoplay=1' : ''}`);

      // update the array of elements
      const updatedElements = elements;
      updatedElements.push(newVideoElement);
      // update the current slide
      const updatedSlide = currentSlide;
      updatedSlide.elements = updatedElements;
      currentSlide = updatedSlide;
      const updatedSlides = slides;
      updatedSlides[currentSlideIndex] = updatedSlide;
      setSlides(updatedSlides);
      // update the store
      const newPresentation = presentation;
      newPresentation.slides = updatedSlides;
      const updatedStore = { presentations: store.presentations.map(p => Number(p.id) === Number(id) ? newPresentation : p) };
      setStore(updatedStore);
    }
    // reset all the element inputs
    setNewVideoUrl('');
    setVideoAutoplay(false);
    setElementWidth(0);
    setElementHeight(0);
    setShowVideoModal(false);
  }

  // nav to dash and save changes on API
  const backtoDashboard = () => {
    navigate('/dashboard');
  }

  return (
    <>
      <Header>
        <StyledHeading>Edit Presentation</StyledHeading>
        <StyleHeaderdButtonsContainer className='mt-1'>
          <StyledBackButton data-testid="backtodash" onClick={backtoDashboard}>← Back to Dashboard</StyledBackButton>
          <LogoutButton>Logout</LogoutButton>
        </StyleHeaderdButtonsContainer>
      </Header>
      {presentation && <StyledContainer>
        <StyledButtonsContainer className='col-3'>
          <StyledButton data-testid="addslide" variant='outline-info' onClick={handleAddSlide} >Add Slide</StyledButton>
          <DeletePresentation presentationId={id} ></DeletePresentation>
          <EditThumbnail presentationId={id} ></EditThumbnail>
        </StyledButtonsContainer>
        <StyledButtonsContainer className='col-3'>
          <StyledDeleteSlideButton variant='outline-info' onClick={handleDeleteSlide} >Delete Slide</StyledDeleteSlideButton>
          <StyledAddTextButton variant='outline-info' onClick={handleOpenTextModal} >Add Text Box</StyledAddTextButton>
          <StyledAddImageButton variant='outline-info' onClick={handleOpenImageModal} >Add Image</StyledAddImageButton>
          <StyledAddVideoButton variant='outline-info' onClick={handleOpenVideoModal}>Add Video</StyledAddVideoButton>
        </StyledButtonsContainer>
        <h2>{presentation.title} <EditPresentationTitle presentationId={id}></EditPresentationTitle></h2>
        <StyledSlideSection>
          {currentSlideIndex > 0 && <StyledArrowLeft data-testid="goleft" onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}></StyledArrowLeft>}
          <Slide slide={currentSlide} slideNumber={currentSlideIndex + 1} ></Slide>
          {currentSlideIndex < slides.length - 1 && <StyledArrowRight data-testid="goright" onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}></StyledArrowRight>}
        </StyledSlideSection>
      </StyledContainer>}
      {showModal && (
      <StyledModal $isclosing={isClosing} className="modal show" tabIndex="-1">
        <StyledModalDialog className="modal-dialog">
          <StyledModalContent className="modal-content">
            <StyledModalHeader className="modal-header">
              <StyledModalTitle className="modal-title">Cannot delete the only slide !!! Please delete the presentation instead.</StyledModalTitle>
              <StyledCloseButton onClick={handleCloseModal}>
                <span>&times;</span>
              </StyledCloseButton>
            </StyledModalHeader>
          </StyledModalContent>
        </StyledModalDialog>
      </StyledModal>
      )}
      {showTextModal && (
        <StyledModal $isclosing={isClosing} className="modal show" tabIndex="-1">
          <StyledModalDialog className="modal-dialog">
            <StyledModalContent className="modal-content">
              <StyledModalHeader className="modal-header">
                <StyledModalTitle className="modal-title">Add text box</StyledModalTitle>
                <StyledCloseButton onClick={handleCloseTextModal}>
                  <span>&times;</span>
                </StyledCloseButton>
              </StyledModalHeader>
              <StyledModalBody className="modal-body">
              <StyledForm onSubmit={handleAddText}>
                <StyledFormGroup className="form-group">
                <Label htmlFor="textContent">Text</Label>
                {textError && <ErrorMessage>Text is required !!!</ErrorMessage>}
                  <StyledInput
                    id="textContent"
                    type="text"
                    className="form-control"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Enter text"
                  />
                <Label htmlFor="textWidth">Width</Label>
                {invalidWidth && <ErrorMessage>Invalid input !!! The value must be between 0 and 100</ErrorMessage>}
                  <StyledInput
                    id="textWidth"
                    type="number"
                    className="form-control"
                    onChange={handleWidthChange}
                    placeholder="Enter the width of text"
                  />
                <Label htmlFor="textHeight">Height</Label>
                {invalidHeight && <ErrorMessage>Invalid input !!! The value must be between 0 and 100</ErrorMessage>}
                  <StyledInput
                    id="textHeight"
                    type="number"
                    className="form-control"
                    onChange={handleHeightChange}
                    placeholder="Enter the height of text"
                  />
                <Label htmlFor="textFont">Font-size</Label>
                <StyledInput
                  id="textFont"
                  type="number"
                  className="form-control"
                  onChange={(e) => setElementFontSize(e.target.value)}
                  placeholder="Font-size in em (e.g. 1.5)"
                />
                <Label htmlFor="textColor">Font-color</Label>
                <StyledInput
                  id="textColor"
                  type="text"
                  className="form-control"
                  onChange={(e) => setElementFontColor(e.target.value)}
                  placeholder="Hex Color Code (e.g. #ff0000)"
                />
                </StyledFormGroup>
                <StyledSubmitButton>Add Text Box</StyledSubmitButton>
              </StyledForm>
            </StyledModalBody>
            </StyledModalContent>
          </StyledModalDialog>
        </StyledModal>
      )}
      {showImageModal && (
        <StyledModal $isclosing={isClosing} className="modal show" tabIndex="-1">
          <StyledModalDialog className="modal-dialog">
            <StyledModalContent className="modal-content">
              <StyledModalHeader className="modal-header">
                <StyledModalTitle className="modal-title">Add image box</StyledModalTitle>
                <StyledCloseButton onClick={handleCloseImageModal}>
                  <span>&times;</span>
                </StyledCloseButton>
              </StyledModalHeader>
              <StyledModalBody className="modal-body">
              <StyledForm onSubmit={handleAddImage}>
                <StyledFormGroup className="form-group">
                <Label htmlFor="image-upload">Upload image from your system</Label>
                {imageError && <ErrorMessage>You must either choose one of two ways to upload the image !!!</ErrorMessage>}
                  <StyledInput
                    id="image-upload"
                    type="file"
                    onChange={(e) => setNewImage(e.target.files[0])}
                    name="image-upload"
                    accept="image/*"
                  />
                <br />
                <p>Or</p>
                <Label htmlFor="image-url">Upload image from the internet</Label>
                {imageError && <ErrorMessage>You must either choose one of two ways to upload the image !!!</ErrorMessage>}
                  <StyledInput
                    id="image-url"
                    type="text"
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="form-control"
                    placeholder="Enter the image URL here"
                  />
                <Label htmlFor="image-description">Give image description</Label>
                  <StyledInput
                    id="image-description"
                    type="text"
                    className="form-control"
                    placeholder="Enter your image description here"
                  />
                <p>Image specifications:</p>
                <Label htmlFor="imageWidth">Width</Label>
                {invalidWidth && <ErrorMessage>Invalid input !!! The value must be between 0 and 100</ErrorMessage>}
                  <StyledInput
                    id="imageWidth"
                    type="number"
                    className="form-control"
                    onChange={handleWidthChange}
                    placeholder="Enter the width of image"
                  />
                <Label htmlFor="imageHeight">Height</Label>
                {invalidHeight && <ErrorMessage>Invalid input !!! The value must be between 0 and 100</ErrorMessage>}
                  <StyledInput
                    id="imageHeight"
                    type="number"
                    className="form-control"
                    onChange={handleHeightChange}
                    placeholder="Enter the height of image"
                  />
                </StyledFormGroup>
                <StyledSubmitButton>Add Image</StyledSubmitButton>
              </StyledForm>
            </StyledModalBody>
            </StyledModalContent>
          </StyledModalDialog>
        </StyledModal>
      )}
      {showVideoModal && (
        <StyledModal $isclosing={isClosing} className="modal show" tabIndex="-1">
          <StyledModalDialog className="modal-dialog">
            <StyledModalContent className="modal-content">
              <StyledModalHeader className="modal-header">
                <StyledModalTitle className="modal-title">Add Video box</StyledModalTitle>
                <StyledCloseButton onClick={handleCloseVideoModal}>
                  <span>&times;</span>
                </StyledCloseButton>
              </StyledModalHeader>
              <StyledModalBody className="modal-body">
              <StyledForm onSubmit={handleAddVideo}>
                <StyledFormGroup className="form-group">
                <Label htmlFor="video-url">Upload video from the internet</Label>
                {videoError && <ErrorMessage>The video URL is required !!!</ErrorMessage>}
                  <StyledInput
                    id="video-url"
                    type="text"
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="form-control"
                    placeholder="Enter the video URL here"
                  />
                <p>Video specifications:</p>
                <Label htmlFor="videoWidth">Width</Label>
                {invalidWidth && <ErrorMessage>Invalid input !!! The value must be between 0 and 100</ErrorMessage>}
                  <StyledInput
                    id="videoWidth"
                    type="number"
                    className="form-control"
                    onChange={handleWidthChange}
                    placeholder="Enter the width of video"
                  />
                <Label htmlFor="videoHeight">Height</Label>
                {invalidHeight && <ErrorMessage>Invalid input !!! The value must be between 0 and 100</ErrorMessage>}
                  <StyledInput
                    id="videoHeight"
                    type="number"
                    className="form-control"
                    onChange={handleHeightChange}
                    placeholder="Enter the height of video"
                  />
                  <StyledCheckboxLabel htmlFor="videoAutoPlay">Do you want it to auto-play?</StyledCheckboxLabel>
                  <StyledCheckbox
                    id="videoAutoPlay"
                    type="checkbox"
                    onChange={(e) => setVideoAutoplay(e.target.checked)}
                  />
                </StyledFormGroup>
                <StyledSubmitButton>Add Image</StyledSubmitButton>
              </StyledForm>
            </StyledModalBody>
            </StyledModalContent>
          </StyledModalDialog>
        </StyledModal>
      )}
    </>
  );
}

export default EditPresentation;

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

const StyledArrowRight = styled(FaArrowRight)`
  font-size: 3rem;
  transition: transform 0.3s;

  &:hover {
    cursor: pointer;
    transform: scale(1.3);
    color: blue;
  }
`;

const StyledArrowLeft = styled(FaArrowLeft)`
  font-size: 3rem;
  transition: transform 0.3s;

  &:hover {
    cursor: pointer;
    transform: scale(1.3);
    color: blue;
  }
`;

const StyledSlideSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

const StyledContainer = styled(Container)`
  margin-left: 10px;
`;

const StyledHeading = styled.h2`

`;

const StyleHeaderdButtonsContainer = styled.div`
  margin-left: 20px;
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  font-size: 1rem;
`;

const StyledDeleteSlideButton = styled(Button)`
  font-size: 1rem;
  border-radius: 0px;
  border-right: none;
`;

const StyledAddTextButton = styled(Button)`
  font-size: 1rem;
  border-radius: 0px;
  border-right: none;
  border-left: none;
`;

const StyledAddImageButton = styled(Button)`
  font-size: 1rem;
  border-radius: 0px;
  border-left: none;
  border-right: none;
`;

const StyledAddVideoButton = styled(Button)`
  font-size: 1rem;
  border-radius: 0px;
  border-left: none;
`;

const StyledBackButton = styled(Button)`
  font-size: 1rem;
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
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .5rem;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
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

const StyledCheckboxLabel = styled.label`
  display: inline-block;
  color: #8a2be2;
  align-items: center;
  margin-bottom: 15px;
  margin-right: 1rem;
  vertical-align: middle;
`;

const StyledCheckbox = styled.input`
  width: 20px;
  height: 20px;
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
  padding-right: 25px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(0, 225, 255);
`;
const Label = styled.label`
  color: #8a2be2;
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  svg {
    margin-right: 5px;
  }
`;
