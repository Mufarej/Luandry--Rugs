import { useEffect, useState, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface OrderUpdate {
  id: string;
  orderId: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  updatedAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    itemName: string;
    serviceName: string;
    quantity: number;
    totalPrice: number;
  }>;
}

interface UseRealtimeOptions {
  onOrderUpdate?: (order: OrderUpdate) => void;
  onOrderCreated?: (order: OrderUpdate) => void;
  onConnectionChange?: (connected: boolean) => void;
}

let socketInstance: Socket | null = null;

export function useRealtime(options: UseRealtimeOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [orders, setOrders] = useState<OrderUpdate[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only create socket if not already created
    if (!socketInstance) {
      socketInstance = io(undefined, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketInstance.on('connect', () => {
        setIsConnected(true);
        options.onConnectionChange?.(true);
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        options.onConnectionChange?.(false);
      });

      socketInstance.on('order:updated', (order: OrderUpdate) => {
        setOrders(prev => {
          const index = prev.findIndex(o => o.id === order.id);
          if (index > -1) {
            const updated = [...prev];
            updated[index] = order;
            return updated;
          }
          return [...prev, order];
        });
        options.onOrderUpdate?.(order);
      });

      socketInstance.on('order:created', (order: OrderUpdate) => {
        setOrders(prev => [order, ...prev]);
        options.onOrderCreated?.(order);
      });
    }

    socketRef.current = socketInstance;

    return () => {
      // Don't disconnect socket, keep it alive
    };
  }, [options]);

  const subscribeToOrder = useCallback((orderId: string) => {
    socketRef.current?.emit('subscribe:order', orderId);
  }, []);

  const unsubscribeFromOrder = useCallback((orderId: string) => {
    socketRef.current?.emit('unsubscribe:order', orderId);
  }, []);

  const subscribeToAllOrders = useCallback(() => {
    socketRef.current?.emit('subscribe:all-orders');
  }, []);

  const unsubscribeFromAllOrders = useCallback(() => {
    socketRef.current?.emit('unsubscribe:all-orders');
  }, []);

  return {
    isConnected,
    orders,
    subscribeToOrder,
    unsubscribeFromOrder,
    subscribeToAllOrders,
    unsubscribeFromAllOrders,
  };
}
