import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  imageUrl: string;
  size?: 20 | 30 | 40;
}

export const PizzaImage: React.FC<Props> = ({ imageUrl, size = 40, className }) => {
  // Base size (largest)
  const baseImageSize = 500;

  // Calculate scale factor based on pizza size
  const scaleFactor = size === 20 ? 350 / baseImageSize : size === 30 ? 420 / baseImageSize : 1;

  return (
    // Restore relative positioning for the main container
    <div className={cn('flex items-center justify-center flex-1 relative w-full', className)}>
      {/* Background circles with fixed sizes, positioned absolutely */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-2 rounded-full border-gray-300 w-[450px] h-[450px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dotted border-2 rounded-full border-gray-200 w-[370px] h-[370px]" />

      {/* Pizza image - Relative position, use scale transform for animation */}
      <img
        src={imageUrl}
        alt="Pizza"
        style={{
          width: `${baseImageSize}px`, // Base width
          height: `${baseImageSize}px`, // Base height
          transform: `scale(${scaleFactor})`, // Apply scale
        }}
        // Use relative positioning within the flex container
        className="relative z-10 transition-transform duration-500 ease-in-out transform-gpu"
      />
    </div>
  );
};
