"use client";

import { useEffect, useState } from 'react';

interface AnimatedGifProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  playOnHover?: boolean;
  loop?: boolean;
}

const AnimatedGif: React.FC<AnimatedGifProps> = ({
  src,
  alt,
  className = '',
  style = {},
  playOnHover = false,
  loop = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gifSrc, setGifSrc] = useState(playOnHover ? '' : src);

  // Update gif source when hover state changes (for playOnHover)
  useEffect(() => {
    if (playOnHover) {
      setGifSrc(isHovered ? src : '');
    }
  }, [isHovered, playOnHover, src]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={() => playOnHover && setIsHovered(true)}
      onMouseLeave={() => playOnHover && setIsHovered(false)}
    >
      {gifSrc ? (
        <img
          src={gifSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          style={{ ...style, imageRendering: 'pixelated' }}
        />
      ) : (
        <div className="w-full h-full bg-black/20" />
      )}
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"
          style={{
            animation: 'scanline 8s linear infinite',
            backgroundSize: '100% 8px',
          }}
        />
      </div>
      
      {/* Glitch effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 45%, #ff00ff44 49%, #ff00ff44 51%, transparent 55%)',
              backgroundSize: '200% 200%',
              animation: 'glitch 0.5s infinite',
              mixBlendMode: 'overlay',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AnimatedGif;
