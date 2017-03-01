import socketio from 'socket.io';


export default function(server) {
  const socket = socketio(server);

  socket.on('connection', client => {
    console.log('a user connected');
    console.log(client);
  });
}