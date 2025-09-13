import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SlidingImageCarousel = ({ product }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [availableImages, setAvailableImages] = useState([]);

  useEffect(() => {
    // Build array of available images
    const images = [];

    // Main product image
    if (product.image) {
      images.push({
        src: product.image,
        alt: product.name,
        key: "main",
      });
    }

    // Additional images
    if (product.image1) {
      images.push({
        src: product.image1,
        alt: `${product.name} - Image 1`,
        key: "image1",
      });
    }

    if (product.image2) {
      images.push({
        src: product.image2,
        alt: `${product.name} - Image 2`,
        key: "image2",
      });
    }

    // Fallback to placeholder if no images
    if (images.length === 0) {
      images.push({
        src: "/placeholder.svg",
        alt: product.name,
        key: "placeholder",
      });
    }

    setAvailableImages(images);
  }, [product]);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % availableImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + availableImages.length) % availableImages.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Don't render carousel controls if only one image
  const showControls = availableImages.length > 1;

  return (
    <div className="relative overflow-hidden">
      {/* Images Container */}
      <div
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {availableImages.map((image, index) => (
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
            key={image.key}
          />
        ))}
      </div>

      {/* Navigation Arrows - Only show if multiple images */}
      {showControls && (
        <>
          {/* <button
            onClick={prevSlide}
            //className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
            aria-label="Previous image"
          > */}
          <ChevronLeft
            onClick={prevSlide}
            size={20}
            className="absolute  left-2 top-1/2 transform -translate-y-1/2  bg-white/80 hover:bg-white rounded-full  shadow-md transition-all duration-200"
            
          />
          {/* </button> */}

          {/* <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
            aria-label="Next image"
          > */}
          <ChevronRight
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full  shadow-md transition-all duration-200"
            size={20}
            onClick={nextSlide}
          />
          {/* </button> */}
        </>
      )}

      {/* Dots Indicator - Only show if multiple images */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {availableImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? "bg-white shadow-md"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {/* {showControls && (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
          {currentSlide + 1} / {availableImages.length}
        </div>
      )} */}
    </div>
  );
};
