'use client';

import { useEffect, useState, useRef } from 'react';

/** Possible order status values. */
export type OrderStatus = 'PENDING' | 'SUCCEEDED' | 'CANCELED';

interface UseOrderStatusOptions {
  /** ID of the order to watch. Pass `null` to disable. */
  orderId: number | null;
}

interface UseOrderStatusResult {
  /** The current order status, or null if not yet received. */
  status: OrderStatus | null;
  /** Whether the SSE connection is currently active. */
  connected: boolean;
  /** Any error message from the stream. */
  error: string | null;
}

/**
 * Subscribes to Server-Sent Events for real-time order status updates.
 * Automatically reconnects if the connection is lost.
 *
 * @param options.orderId - The order ID to watch. Set to null to disable.
 * @returns Current order status, connection state, and error message.
 */
export function useOrderStatus({ orderId }: UseOrderStatusOptions): UseOrderStatusResult {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const connect = () => {
      const url = `/api/orders/stream?orderId=${orderId}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => {
        setConnected(true);
        setError(null);
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as {
            type: string;
            status?: OrderStatus;
            message?: string;
          };

          if (data.type === 'status_update' && data.status) {
            setStatus(data.status);
          } else if (data.type === 'error') {
            setError(data.message ?? 'Unknown error');
            es.close();
            setConnected(false);
          }
        } catch {
          console.error('[useOrderStatus] Failed to parse SSE event:', event.data);
        }
      };

      es.onerror = () => {
        setConnected(false);
        es.close();
        // Reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
      setConnected(false);
    };
  }, [orderId]);

  return { status, connected, error };
}
