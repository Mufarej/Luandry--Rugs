import { Server as HTTPServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

const ioHandlers = new Map();

export function initializeSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle order subscriptions
    socket.on('subscribe:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      console.log(`Socket ${socket.id} subscribed to order ${orderId}`);
    });

    socket.on('unsubscribe:order', (orderId: string) => {
      socket.leave(`order:${orderId}`);
      console.log(`Socket ${socket.id} unsubscribed from order ${orderId}`);
    });

    socket.on('subscribe:all-orders', () => {
      socket.join('all-orders');
      console.log(`Socket ${socket.id} subscribed to all orders`);
    });

    socket.on('unsubscribe:all-orders', () => {
      socket.leave('all-orders');
      console.log(`Socket ${socket.id} unsubscribed from all orders`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Utility function to emit order updates
export function emitOrderUpdate(io: SocketIOServer, orderId: string, orderData: any) {
  io.to(`order:${orderId}`).emit('order:updated', orderData);
  io.to('all-orders').emit('order:updated', orderData);
}

// Utility function to emit order created
export function emitOrderCreated(io: SocketIOServer, orderData: any) {
  io.to('all-orders').emit('order:created', orderData);
}

export const socketIOInstance: { io?: SocketIOServer } = {};
