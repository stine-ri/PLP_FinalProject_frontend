import { io } from 'socket.io-client';

export const socket = io('https://mama-shule.onrender.com', {
  transports: ['polling'], // ⬅️ Use polling first
  withCredentials: true,
  timeout: 10000
});

socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ Socket connection error:', err);
});
