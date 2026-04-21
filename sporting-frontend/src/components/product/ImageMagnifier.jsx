import React, { useState, useRef } from 'react';

const ImageMagnifier = ({ images = [], zoomLevel = 2 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });
  const containerRefs = useRef([]);

  const handleMouseMove = (e, idx) => {
    const container = containerRefs.current[idx];
    if (!container) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMagnifierPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const currentImages = images.length > 0 ? images.slice(0, 6) : ['https://via.placeholder.com/600x800?text=SportingShop'];

  return (
    <div className="row g-2 w-100 m-0">
      {currentImages.map((img, idx) => (
        <div key={idx} className="col-6 mb-2">
          <div
            ref={(el) => (containerRefs.current[idx] = el)}
            className="position-relative overflow-hidden cursor-zoom-in border border-light"
            style={{ 
                aspectRatio: '4/5', 
                backgroundColor: '#f6f6f6',
                cursor: 'zoom-in'
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onMouseMove={(e) => handleMouseMove(e, idx)}
          >
            {/* Ảnh gốc */}
            <img
              src={img}
              alt={`product-${idx}`}
              className="w-100 h-100 object-fit-contain transition-opacity"
              style={{ 
                mixBlendMode: 'multiply',
                opacity: hoveredIdx === idx ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
            />

            {/* Ảnh đã phóng to (Zoom in-place) */}
            {hoveredIdx === idx && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  backgroundImage: `url("${img}")`,
                  backgroundPosition: `${magnifierPos.x}% ${magnifierPos.y}%`,
                  backgroundSize: `${zoomLevel * 100}%`,
                  backgroundRepeat: 'no-repeat',
                  zIndex: 10
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageMagnifier;
