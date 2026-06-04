import { Container, Title } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Container className="mt-10">
      <Title text="Pizzas" size="lg" className="font-extrabold mb-8" />
      
      {/* Top Bar Skeleton */}
      <div className="flex gap-2 mb-10 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
        {/* Filters Sidebar Skeleton */}
        <div className="hidden lg:block lg:w-62.5">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-50 w-full rounded-xl" />
            <Skeleton className="h-37.5 w-full rounded-xl" />
            <Skeleton className="h-75 w-full rounded-xl" />
          </div>
        </div>

        {/* Products List Skeleton */}
        <div className="flex-1">
          <div className="flex flex-col gap-16">
            <div className="w-full">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col">
                    <Skeleton className="w-full h-65 rounded-xl mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between items-center mt-auto">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-10 w-28 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
