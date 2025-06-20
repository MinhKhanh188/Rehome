// front-end/src/socket.js
import { io } from 'socket.io-client';

const socket = io(
  //import.meta.env.VITE_BACKEND_LOCAL_URL
  import.meta.env.VITE_BACKEND_PRODUCTION_URL_DEV
  , {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;

