import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook để lazy load hình ảnh sử dụng Intersection Observer API
 * @param {string} src - URL hình ảnh
 * @param {string} placeholderSrc - URL ảnh placeholder
 * @returns {string} - URL của hình ảnh đã load hoặc placeholder
 */
export const useLazyImage = (src, placeholderSrc = 'https://placehold.co/400x300?text=Loading') => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setImageSrc(src);
              observer.unobserve(entry.target);
            };
            img.onerror = () => {
              setImageSrc(placeholderSrc);
            };
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imageRef) {
      observer.observe(imageRef);
    }

    return () => {
      if (imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, placeholderSrc, imageRef]);

  return { imageSrc, setImageRef };
};

/**
 * Component wrapper cho lazy loading images
 */
export const LazyImage = ({ 
  src, 
  alt = 'Image', 
  placeholder = 'https://placehold.co/400x300?text=Loading',
  className = '',
  style = {}
}) => {
  const { imageSrc, setImageRef } = useLazyImage(src, placeholder);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        transition: 'opacity 0.3s ease'
      }}
    />
  );
};

/**
 * Component để lazy load images trong list (tối ưu hiệu năng)
 */
export const OptimizedImage = ({ 
  src, 
  alt = 'Image',
  width = 'auto',
  height = 'auto', 
  className = '',
  objectFit = 'cover'
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = src;
            img.onload = () => setIsLoading(false);
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.01 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <div
      ref={imgRef}
      style={{
        width,
        height,
        backgroundColor: isLoading ? '#f0f0f0' : 'transparent',
        overflow: 'hidden'
      }}
      className={className}
    >
      <img
        src={imageSrc}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          opacity: isLoading ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};

export default useLazyImage;
