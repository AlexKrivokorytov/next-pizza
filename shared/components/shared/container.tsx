import { cn } from '@/shared/lib/utils';
import React from 'react';

interface Props {
  className?: string;
}

/**
 * Responsive layout container component with max width and horizontal centering.
 *
 * @param className - Additional class names for the container.
 * @param children - React children nodes.
 *
 * @returns A div wrapping the children with layout styles.
 */
export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
  return <div className={cn('mx-auto max-w-[1280px]', className)}>{children}</div>;
};
