'use client';

import { useState, useMemo } from 'react';

export interface UseSetActions<K> {
  add: (key: K) => void;
  remove: (key: K) => void;
  toggle: (key: K) => void;
  clear: () => void;
  reset: () => void;
  has: (key: K) => boolean;
}

export function useSet<K>(initialSet = new Set<K>()): [Set<K>, UseSetActions<K>] {
  const [set, setSet] = useState<Set<K>>(initialSet);

  const actions = useMemo<UseSetActions<K>>(
    () => ({
      add: (item: K) => setSet((prev) => new Set(prev).add(item)),
      remove: (item: K) =>
        setSet((prev) => {
          const next = new Set(prev);
          next.delete(item);
          return next;
        }),
      toggle: (item: K) =>
        setSet((prev) => {
          const next = new Set(prev);
          if (next.has(item)) {
            next.delete(item);
          } else {
            next.add(item);
          }
          return next;
        }),
      clear: () => setSet(new Set()),
      reset: () => setSet(initialSet),
      has: (item: K) => set.has(item),
    }),
    [set, initialSet]
  );

  return [set, actions];
}
