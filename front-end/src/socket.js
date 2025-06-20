// front-end/src/socket.js
import { io } from 'socket.io-client';

const socketUrl = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_BACKEND_LOCAL_URL
  : process.env.REACT_APP_BACKEND_PRODUCTION_URL_DEV;

const socket = io(socketUrl, {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;
