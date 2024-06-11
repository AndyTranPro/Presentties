import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import defaultThumbnail from '../assets/defaultThumbnail.jpg';

// Define the keyframes
const colorChange = keyframes`
  0% { background-color: white; }
  50% { background-color: lightgrey; }
  100% { background-color: white; }
`;

// Styled components

const StyledContainer = styled(Container)`
  overflow-y: auto;
  padding-right: 25px;
  height: 70vh;

  /* Width */
  &::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to right, #74ebd5, #acb6e5);
  }

  /* Hide scrollbar buttons */
  &::-webkit-scrollbar-button {
    display: none;
  }
`;

const StyledCard = styled(Card)`
  min-width: 100px;
  aspect-ratio: 2 / 1;
  margin-top: 20px;
  border: none;
  padding: 20px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
    animation: ${colorChange} 2s linear infinite;
  }
`;

const Presentations = ({ userPresentations, store }) => {
  const navigate = useNavigate();
  const navigateToEditPage = (presentation) => {
    navigate(`/presentation/${presentation.id}/edit`);
  };
  return (
    <StyledContainer fluid className='mt-2'>
      <Row>
      {userPresentations && userPresentations.map((presentation) => (
          <Col xs={12} sm={6} md={4} lg={3} key={presentation.id}>
            <StyledCard data-testid="pre" onClick={() => navigateToEditPage(presentation, store)}>
              <Card.Img
                src={presentation.thumbnail || defaultThumbnail}
              />
              <Card.Body>
                <Card.Title>{presentation.title}</Card.Title>
                <Card.Text>
                  {presentation.description || 'No text'}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">{presentation.slides.length} slides</small>
              </Card.Footer>
            </StyledCard>
          </Col>
      ))}
      </Row>
    </StyledContainer>
  );
};
export default Presentations;
