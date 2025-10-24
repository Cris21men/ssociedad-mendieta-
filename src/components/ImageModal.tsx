import React from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Image {
  src: string;
  alt: string;
  title?: string;
}

interface ImageModalProps {
  image: Image;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalImages?: number;
}

const ImageModal: React.FC<ImageModalProps> = ({
  image,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  currentIndex,
  totalImages,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="image-modal-backdrop" onClick={handleBackdropClick}>
        <div className="image-modal-content">
          <button className="image-modal-close" onClick={onClose} aria-label="Cerrar">
            <FaTimes />
          </button>

          {onPrevious && (
            <button
              className="image-modal-nav image-modal-prev"
              onClick={onPrevious}
              aria-label="Imagen anterior"
            >
              <FaChevronLeft />
            </button>
          )}

          <div className="image-modal-image-container">
            <img src={image.src} alt={image.alt} className="image-modal-image" />
            {image.title && <p className="image-modal-title">{image.title}</p>}
            {currentIndex !== undefined && totalImages && (
              <p className="image-modal-counter">
                {currentIndex + 1} / {totalImages}
              </p>
            )}
          </div>

          {onNext && (
            <button
              className="image-modal-nav image-modal-next"
              onClick={onNext}
              aria-label="Imagen siguiente"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>

      <style>{`
        .image-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease-in-out;
        }

        .image-modal-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-modal-close {
          position: absolute;
          top: -50px;
          right: 0;
          background-color: transparent;
          color: white;
          border: none;
          font-size: 32px;
          cursor: pointer;
          z-index: 10001;
          transition: transform 0.3s;
          padding: 10px;
        }

        .image-modal-close:hover {
          transform: scale(1.2);
        }

        .image-modal-nav {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          font-size: 32px;
          cursor: pointer;
          padding: 20px;
          border-radius: 8px;
          transition: all 0.3s;
          z-index: 10001;
        }

        .image-modal-nav:hover {
          background-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .image-modal-prev {
          left: 20px;
        }

        .image-modal-next {
          right: 20px;
        }

        .image-modal-image-container {
          text-align: center;
        }

        .image-modal-image {
          max-width: 90vw;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .image-modal-title {
          color: white;
          margin-top: 16px;
          font-size: 20px;
          font-weight: 600;
        }

        .image-modal-counter {
          color: rgba(255, 255, 255, 0.7);
          margin-top: 8px;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .image-modal-nav {
            font-size: 24px;
            padding: 12px;
          }

          .image-modal-prev {
            left: 10px;
          }

          .image-modal-next {
            right: 10px;
          }

          .image-modal-close {
            top: -40px;
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
};

export default ImageModal;