// front-end/src/socket.js
import { io } from 'socket.io-client';

const socketUrl =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_BACKEND_LOCAL_URL
    : import.meta.env.VITE_BACKEND_PRODUCTION_URL_DEV;

const socket = io(socketUrl, {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;
