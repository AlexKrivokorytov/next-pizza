// /shared/components/shared/pizza-image.tsx
import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
  className?: string;
  imageUrl: string;
  size?: 20 | 30 | 40;
}

/**
 * Renders a pizza image with decorative background circles and responsive scaling.
 *
 * @param imageUrl - URL of the pizza image.
 * @param size - Pizza size (20, 30, or 40 cm).
 * @param className - Additional class names for the image container.
 *
 * @returns A styled pizza image with background effects.
 */
export const PizzaImage: React.FC<Props> = ({ imageUrl, size = 40, className }) => {
  // Calculate scale factor based on pizza size
  const scaleFactor = size === 20 ? 0.7 : size === 30 ? 0.85 : 1;

  return (
    <div
      className={cn('relative w-full aspect-square flex items-center justify-center', className)}
    >
      {/* Background circles with relative sizing that scales with container */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dotted border-2 rounded-full border-gray-400/50 w-[75%] h-[75%]" />
      <div className="absolute w-[65%] h-[65%] rounded-full border-2 border-dashed border-gray-300/30" />

      {/* Pizza image - Use responsive width with aspect ratio preservation */}
      <img
        src={imageUrl}
        alt="Pizza"
        style={{
          transform: `scale(${scaleFactor})`, // Apply scale based on size
        }}
        className="relative z-10 w-[80%] h-auto object-contain transition-transform duration-500 ease-in-out transform-gpu"
      />
    </div>
  );
};
