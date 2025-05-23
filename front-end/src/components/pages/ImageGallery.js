import React, { useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import '../css/ImageGallery.css'; // Import your CSS file

export function ImageGallery({ images, productTitle, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(false);

  // Safety check
  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };

  const toggleLightbox = () => {
    setLightboxOpen((prev) => !prev);
    setZoom(false);
  };

  const toggleZoom = () => {
    setZoom((prev) => !prev);
  };

  return (
    <Container className={`image-gallery ${className}`}>
      {/* Main image */}
      <div
        className="main-image-container rounded mb-4"
        onClick={toggleLightbox}
      >
        <img
          src={images[currentIndex]}
          alt={`${productTitle} - image ${currentIndex + 1}`}
          className="main-image"
        />

        {/* Navigation arrows for main image */}
        {images.length > 1 && (
          <>
            <Button
              variant="light"
              className="nav-button prev-button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="light"
              className="nav-button next-button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}

        {/* Indicator for zoom availability */}
        <div className="zoom-indicator">
          <ZoomIn size={14} className="me-1" />
          <span>Click to zoom</span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Row className="thumbnails g-2">
          {images.map((image, index) => (
            <Col xs={3} sm={2} key={index}>
              <Button
                variant="link"
                className={`thumbnail-button ${currentIndex === index ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${productTitle} - thumbnail ${index + 1}`}
                  className="thumbnail-image"
                />
              </Button>
            </Col>
          ))}
        </Row>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox" onClick={toggleLightbox}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="link"
              className="close-button"
              onClick={toggleLightbox}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </Button>

            {/* Zoom toggle button */}
            <Button
              variant="link"
              className="zoom-button"
              onClick={toggleZoom}
              aria-label={zoom ? 'Zoom out' : 'Zoom in'}
            >
              {zoom ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
            </Button>

            {/* Image container */}
            <div
              className={`lightbox-image-container ${zoom ? 'zoomed' : ''}`}
              onClick={!zoom ? toggleZoom : undefined}
            >
              <img
                src={images[currentIndex]}
                alt={`${productTitle} - fullscreen view`}
                className={zoom ? 'lightbox-image-zoomed' : 'lightbox-image'}
              />
            </div>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="link"
                  className="lightbox-nav-button prev"
                  onClick={handlePrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </Button>
                <Button
                  variant="link"
                  className="lightbox-nav-button next"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="image-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}