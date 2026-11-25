import React, { useState } from 'react';
import { Dish } from '../types';
import { DishArtwork } from './DishArtwork';

interface DishImageProps {
  picsumSeed: string;
  artworkId: Dish['artworkId'] | 'green-bowl-hero' | 'protein-house-hero';
  alt: string;
  className?: string;
}

export const DishImage: React.FC<DishImageProps> = ({
  picsumSeed,
  artworkId,
  alt,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(picsumSeed)}/600/450`;

  return (
    <div className={`relative overflow-hidden bg-[#EAE6DC] dark:bg-[#20312D] ${className}`}>
      {/* Bespoke SVG illustration acts as instant placeholder and offline fallback */}
      <DishArtwork artworkId={artworkId} className="w-full h-full" />

      {!failed && (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
