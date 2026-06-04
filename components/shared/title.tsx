import clsx from 'clsx';
import React from 'react';

type TitleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  size?: TitleSize;
  className?: string;
  text: string;
}

/**
 * Renders a responsive heading with configurable size and class names.
 *
 * @param text - The heading text content.
 * @param size - The size of the heading (xs, sm, md, lg, xl, 2xl).
 * @param className - Additional class names for the heading.
 *
 * @returns A heading element with the specified text and styles.
 */
export const Title: React.FC<Props> = ({ text, size = 'sm', className }) => {
  const mapTagBySize = {
    xs: 'h5',
    sm: 'h4',
    md: 'h3',
    lg: 'h2',
    xl: 'h1',
    '2xl': 'h1',
  } as const;

  const mapClassNameBySize = {
    xs: 'text-4 ',
    sm: 'text-5.5 ',
    md: 'text-6.5 ',
    lg: 'text-8 ',
    xl: 'text-10 ',
    '2xl': 'text-12 ',
  } as const;

  return React.createElement(
    mapTagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    text,
  );
};
