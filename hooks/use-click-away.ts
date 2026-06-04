'use client';

import { RefObject, useEffect, useRef } from 'react';

export function useClickAway<E extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: string[] = ['mousedown', 'touchstart']
) {
  const savedCallback = useRef(onClickAway);
  
  useEffect(() => {
    savedCallback.current = onClickAway;
  }, [onClickAway]);

  useEffect(() => {
    const handler = (event: any) => {
      const el = ref.current;
      if (el && !el.contains(event.target as Node)) {
        savedCallback.current(event);
      }
    };

    for (const eventName of events) {
      document.addEventListener(eventName, handler);
    }

    return () => {
      for (const eventName of events) {
        document.removeEventListener(eventName, handler);
      }
    };
  }, [ref, events]);
}
