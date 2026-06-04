'use client';

import { RefObject, useEffect, useState } from 'react';

export function useIntersection<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options: IntersectionObserverInit
): IntersectionObserverEntry | null {
  const [intersectionObserverEntry, setIntersectionObserverEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (ref.current && typeof IntersectionObserver === 'function') {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setIntersectionObserverEntry(entries[0]);
      };

      const observer = new IntersectionObserver(handler, options);
      observer.observe(ref.current);

      return () => {
        setIntersectionObserverEntry(null);
        observer.disconnect();
      };
    }
    return () => {};
  }, [ref, options.threshold, options.root, options.rootMargin]);

  return intersectionObserverEntry;
}
