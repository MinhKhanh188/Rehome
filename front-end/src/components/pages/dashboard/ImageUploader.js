// front-end/src/components/pages/dashboard/ImageUploader.js
import { useState, useRef } from 'react';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { PlusCircle, XCircle, Upload, Image, AlertCircle } from 'lucide-react';
import '../../css/ImageUploader.css'; // Import your CSS file

export default function ImageUploader({
  imageUrl = '',
  imageUrls = [],
  onImageUploaded,
  onImagesUploaded,
  isSingleImage = false,
  maxImages = 5,
}) {
  const placeholderImages = [
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764',
    'https://images.unsplash.com/photo-1566647387723-3ffe3a01a046',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
    'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5',
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08',
    'https://images.unsplash.com/photo-1595246007497-68986932fb03',
  ];

  const [uploadedImages, setUploadedImages] = useState(
    isSingleImage && imageUrl ? [imageUrl] : imageUrls || []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!isSingleImage && uploadedImages.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images.`);
      return;
    }

    setError('');
    setIsUploading(true);

    setTimeout(() => {
      const newImages = Array.from(files).map((_, index) => {
        const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
        return `${randomImage}?random=${Date.now() + index}`;
      });

      if (isSingleImage) {
        setUploadedImages([newImages[0]]);
        onImageUploaded?.(newImages[0]);
      } else {
        const updatedImages = [...uploadedImages, ...newImages];
        setUploadedImages(updatedImages);
        onImagesUploaded?.(updatedImages);
      }

      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1000);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);

    if (isSingleImage && updatedImages.length === 0) {
      onImageUploaded?.('');
    } else {
      onImagesUploaded?.(updatedImages);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      {error && (
        <Alert variant="danger" className="error-message mb-3">
          <AlertCircle size={16} className="me-1" />
          {error}
        </Alert>
      )}

      <div className="mb-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple={!isSingleImage}
          className="d-none"
        />

        {isSingleImage ? (
          <div>
            {uploadedImages.length > 0 ? (
              <div className="single-image-container position-relative">
                <img
                  src={uploadedImages[0]}
                  alt="Product"
                  className="single-image"
                />
                <Button
                  variant="link"
                  className="remove-image-btn position-absolute"
                  onClick={() => handleRemoveImage(0)}
                >
                  <XCircle size={20} />
                </Button>
                <Button
                  variant="link"
                  className="replace-image-btn mt-2"
                  onClick={triggerFileInput}
                >
                  <Upload size={14} className="me-1" />
                  Replace image
                </Button>
              </div>
            ) : (
              <div
                onClick={triggerFileInput}
                className="upload-placeholder"
              >
                <Image className="placeholder-icon" size={40} />
                <div className="placeholder-text">
                  <div className="upload-prompt">Click to upload</div>
                  <p className="upload-info">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Row className="g-3 mb-3">
              {uploadedImages.map((img, index) => (
                <Col xs={6} sm={4} key={index}>
                  <div className="multi-image-container position-relative">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="multi-image"
                    />
                    <Button
                      variant="link"
                      className="remove-image-btn position-absolute"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <XCircle size={18} />
                    </Button>
                  </div>
                </Col>
              ))}
              {uploadedImages.length < maxImages && !isUploading && (
                <Col xs={6} sm={4}>
                  <div
                    onClick={triggerFileInput}
                    className="upload-placeholder multi-upload-placeholder"
                  >
                    <PlusCircle className="placeholder-icon" size={32} />
                    <div className="placeholder-text">Add Image</div>
                  </div>
                </Col>
              )}
            </Row>

            {isUploading && (
              <div className="uploading-indicator text-center p-4">
                <div className="spinner"></div>
              </div>
            )}

            {uploadedImages.length === 0 && !isUploading && (
              <Button
                variant="outline-primary"
                onClick={triggerFileInput}
                className="w-100 upload-button"
              >
                <Upload size={16} className="me-2" />
                Upload Images
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="upload-info-text">
        For the best results, use high-quality images that clearly show the product.{' '}
        {!isSingleImage && `You can upload up to ${maxImages} images.`}
      </div>
    </div>
  );
}