// front-end/src/socket.js
import { io } from 'socket.io-client';

const socketUrl = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BACKEND_PRODUCTION_URL_DEV
  : process.env.REACT_APP_BACKEND_LOCAL_URL;

const socket = io(socketUrl, {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;
