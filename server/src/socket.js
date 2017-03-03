import socketio from 'socket.io';
import jwt from 'jsonwebtoken';
import cfg from './config';


export const sockets = new Map();

export default function(app) {
  const server = socketio(app);

  server.on('connection', socket => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.id}`);
    });

    socket.on('subscribe', token => {
      let user = jwt.decode(token, cfg.jwtSecret);
      sockets.set(user.id, socket);
    });
  });
}