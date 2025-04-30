'use client';

import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { useDebouncedCallback } from 'use-debounce';

import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/providers/theme-provider';

type SliderProps = {
  className?: string;
  min: number;
  max: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

/**
 * Range slider component for selecting a numeric range with labels and debounce.
 *
 * @param min - Minimum value of the range.
 * @param max - Maximum value of the range.
 * @param step - Step increment for the slider.
 * @param value - Controlled value array for the slider.
 * @param onValueChange - Callback when the value changes.
 * @param formatLabel - Optional function to format value labels.
 * @param className - Additional class names for the slider.
 *
 * @returns A styled range slider with draggable thumbs and value labels.
 */
const RangeSlider = React.forwardRef(
  (
    { className, min, max, step, formatLabel, value, onValueChange, ...props }: SliderProps,
    ref,
  ) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = React.useState(initialValue);
    const { theme } = useTheme();
    const isDarkPurple = theme === 'dark-purple';
    const [isDragging, setIsDragging] = React.useState(false);

    React.useEffect(() => {
      // Update localValues when the external value prop changes
      if (!isDragging) {
        setLocalValues(Array.isArray(value) ? value : [min, max]);
      }
    }, [min, max, value, isDragging]);

    // Debounce the callback to avoid excessive updates
    const debouncedOnValueChange = useDebouncedCallback((values: number[]) => {
      if (onValueChange) {
        onValueChange(values);
      }
    }, 300);

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues);
      debouncedOnValueChange(newValues);
    };

    return (
      <SliderPrimitive.Root
        ref={ref as React.RefObject<HTMLDivElement>}
        min={min}
        max={max}
        step={step}
        value={localValues}
        onValueChange={handleValueChange}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => {
          setIsDragging(false);
          // Ensure the final value is sent
          if (onValueChange) {
            onValueChange(localValues);
          }
        }}
        className={cn('relative flex w-full touch-none select-none mb-6 items-center', className)}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            'relative h-1 w-full grow overflow-hidden rounded-full',
            isDarkPurple ? 'bg-gray-700' : 'bg-orange-200',
          )}
        >
          <SliderPrimitive.Range
            className={cn('absolute h-full', isDarkPurple ? 'bg-primary/80' : 'bg-orange-500')}
          />
        </SliderPrimitive.Track>
        {localValues.map((value, index) => (
          <React.Fragment key={index}>
            <div
              className="absolute text-center"
              style={{
                left: `calc(${((value - min) / (max - min)) * 100}% + 0px)`,
                top: `10px`,
              }}
            >
              <span className={cn('text-sm', isDarkPurple ? 'text-gray-300' : 'text-orange-800')}>
                {formatLabel ? formatLabel(value) : value}
              </span>
            </div>
            <SliderPrimitive.Thumb
              className={cn(
                'block h-4 w-4 rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                isDarkPurple
                  ? 'border border-primary/80 bg-secondary'
                  : 'border border-orange-500/70 bg-white',
              )}
            />
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  },
);

RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
