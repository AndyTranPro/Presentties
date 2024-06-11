import React from 'react';
import styled from 'styled-components';

const ShowSlide = ({ slide, slideNumber }) => {
  const elements = slide.elements ? slide.elements : [];
  return (
    <StyledSlideContainer>
      {elements && elements.map((element) => {
        if (element.type === 'text') {
          return (
            <StyledTextElement
              key={element.id}
              $fontColor={element.fontColor}
              $fontSize={element.fontSize}
              $width={element.size.width}
              $height={element.size.height}
              $layer={element.position.z}
              $position={element.position}>
                {element.content}
            </StyledTextElement>
          );
        } else if (element.type === 'image') {
          return (
            <StyledImageElement
              key={element.id}
              $width={element.size.width}
              $height={element.size.height}
              $layer={element.position.z}
              $position={element.position}
              src={element.content}
              alt={element.description}>
            </StyledImageElement>
          );
        } else {
          return (
            <StyledVideoElement
              key={element.id}
              $width={element.size.width}
              $height={element.size.height}
              $layer={element.position.z}
              $position={element.position}
              src={`https://www.youtube.com/embed/${element.content}?autoplay=1&mute=1${element.autoPlay === 'true' ? '&autoplay=1' : ''}`}
              controls>
            </StyledVideoElement>
          );
        }
      })}
      <StyledSlideNumber>{slideNumber}</StyledSlideNumber>
    </StyledSlideContainer>
  );
};

export default ShowSlide;

const StyledSlideContainer = styled.div`
  position: relative;
  width: 80vw;
  height: 80vh;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow-x: auto;
  overflow-y: auto;
  margin-right: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  padding: 10px;
  border: 2px solid black;
`;

const StyledSlideNumber = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 1em;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledVideoElement = styled.iframe`
  position: absolute;
  top: ${props => props.$position.y}%;
  left: ${props => props.$position.x}%;
  width: ${props => props.$width}%;
  height: ${props => props.$height}%;
  z-index: ${props => props.$layer};
  border: 2px solid lightgrey;
  object-fit: cover;
`;

const StyledImageElement = styled.img`
  position: absolute;
  top: ${props => props.$position.y}%;
  left: ${props => props.$position.x}%;
  width: ${props => props.$width}%;
  height: ${props => props.$height}%;
  z-index: ${props => props.$layer};
  border: 2px solid lightgrey;
  object-fit: cover;
`;

const StyledTextElement = styled.div`
  position: absolute;
  background-color: white;
  top: ${props => props.$position.y}%;
  left: ${props => props.$position.x}%;
  color: ${props => props.$fontColor};
  font-size:${props => props.$fontSize}em;
  width: ${props => props.$width}%;
  height: ${props => props.$height}%;
  z-index: ${props => props.$layer};
  border: 2px solid lightgrey;
  overflow: hidden;
`;
