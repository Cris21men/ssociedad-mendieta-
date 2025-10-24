import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ImageModal from './ImageModal';

interface Image {
  src: string;
  alt: string;
  title?: string;
}

interface ServiceCarouselProps {
  title: string;
  description: string;
  icon: string;
  images: Image[];
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  title,
  description,
  icon,
  images,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(3); // Empezar en la primera imagen real
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Crear array infinito: últimas 3 + originales + primeras 3
  const infiniteImages = [
    ...images.slice(-3),
    ...images,
    ...images.slice(0, 3)
  ];

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Autoplay automático cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Manejar transición infinita
  useEffect(() => {
    if (currentIndex === infiniteImages.length - 3) {
      // Llegó al final, resetear al inicio real
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(3);
      }, 700);
    } else if (currentIndex === 0) {
      // Llegó al inicio, resetear al final real
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(images.length);
      }, 700);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, images.length, infiniteImages.length]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 3); // +3 porque hay 3 imágenes clonadas al inicio
  };

  const openModal = (index: number) => {
    // Calcular el índice real en el array original
    const realIndex = (index - 3 + images.length) % images.length;
    setSelectedImageIndex(realIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevModalImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Calcular el índice activo para los indicadores
  const activeIndicatorIndex = ((currentIndex - 3) + images.length) % images.length;

  return (
    <>
      <div className="service-carousel">
        <div className="service-carousel-header">
          <div className="service-carousel-title-wrapper">
            <span className="service-carousel-icon">{icon}</span>
            <div>
              <h3 className="service-carousel-title">{title}</h3>
              <p className="service-carousel-description">{description}</p>
            </div>
          </div>
        </div>

        <div className="carousel-container">
          <button className="carousel-button carousel-button-prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>

          <div className="carousel-viewport">
            <div 
              className={`carousel-track ${isTransitioning ? 'transitioning' : ''}`}
              style={{
                transform: `translateX(-${currentIndex * (isMobile ? 100 : 33.333)}%)`
              }}
            >
              {infiniteImages.map((image: Image, index: number) => (
                <div key={index} className="carousel-slide">
                  <div className="carousel-slide-content" onClick={() => openModal(index)}>
                    <img src={image.src} alt={image.alt} />
                    <div className="carousel-image-overlay">
                      <span className="carousel-zoom-icon">🔍</span>
                      <p className="carousel-image-title">Ver imagen</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-button carousel-button-next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </div>

        <div className="carousel-indicators">
          {images.map((_, index: number) => (
            <button
              key={index}
              className={`carousel-indicator ${index === activeIndicatorIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <ImageModal
        image={images[selectedImageIndex]}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={nextModalImage}
        onPrevious={prevModalImage}
        currentIndex={selectedImageIndex}
        totalImages={images.length}
      />
    </>
  );
};

export default ServiceCarousel;