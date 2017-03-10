import socketio from 'socket.io';
import jwt from 'jsonwebtoken';
import cfg from './config';
import { pubsub, subscriptionManager } from './api';


export const sockets = new Map();
export let io = null;

export default function(app) {
  io = socketio(app);

  io.on('connection', socket => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('disconnect', () => {
      //subscriptionManager.unsubscribe(socket.subscriptionId);
      console.log(`A user disconnected: ${socket.id}`);
    });

    socket.on('subscribe', token => {
      let user = jwt.decode(token, cfg.jwtSecret);
      sockets.set(user.id, socket);

      socket.subscriptionId = subscriptionManager.subscribe({
        query: `
          subscription questionCreated {
            questionCreated(user_id: ${user.id}) {
              id
              text
              timestamp
              from {
                username
              }
            }
          }
        `,
        callback: (err, data) => {
          if (err) 
            return console.log('questionCreated subscription error:', err);

          socket.emit('question', data.data.questionCreated);
        },
      });
    });

    socket.on('room', room => {
      if (socket.room)
        socket.leave(socket.room);

      socket.room = room;
      socket.join(room);
    });
  });

  subscriptionManager.subscribe({
    query: `
      subscription questionReplied {
        questionReplied {
          id
          user {
            id
          }
          text
          timestamp
          question {
            id
            text
            timestamp
            from {
              username
            }
          }
        }
      }
    `,
    callback: (err, data) => {
      if (err) 
        return console.log('questionReplied subscription error:', err);
      
      let answer = data.data.questionReplied;
      io.sockets.in(answer.user.id).emit('answer', answer);
    },
  });
}