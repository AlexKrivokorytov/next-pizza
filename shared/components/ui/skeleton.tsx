import { cn } from '@/shared/lib/utils';

/**
 * Skeleton loading placeholder component for UI elements.
 *
 * @param className - Additional class names for the skeleton.
 * @param ...props - Standard div props.
 *
 * @returns A div styled as a skeleton loader.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />;
}

export { Skeleton };
