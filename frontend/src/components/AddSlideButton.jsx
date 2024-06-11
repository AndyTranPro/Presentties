import React, { useState, useContext } from 'react';
import { StoreContext } from './StoreProvider';
import { Button } from 'react-bootstrap';

function AddSlide(presentationId) {
  const [slide, setSlide] = useState('');
  const { store, setStore } = useContext(StoreContext);
  const presentations = store.presentations;
  const presentation = presentations.find(p => Number(p.id) === Number(presentationId));

  const handleAddSlide = (event) => {
    event.preventDefault();
    // Add your logic here to handle the submission of the slide
    const newSlide = {
      id: Date.now(),
      text: '',
      image: '',
      video: '',
      code: '',
    };
    // update the slides of the targeted presentation in the local store
    const newPresentation = presentation;
    newPresentation.slides.push(newSlide);
    const updatedStore = { presentations: store.presentations.map(p => Number(p.id) === Number(presentationId) ? newPresentation : p) };
    setStore(updatedStore);
    console.log('Slide submitted:', slide);
    setSlide('');
  };

  return (
    <>
    <StyledButton variant="outline-info" onClick={handleAddSlide}>
      Add Slide
    </StyledButton>
    </>
  );
}

export default AddSlide;

const StyledButton = styled(Button)`
  font-size: 1rem;
`;
