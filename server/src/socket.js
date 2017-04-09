const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const cfg = require('./config');
const { pubsub, subscriptionManager } = require('./api');


const sockets = new Map();
let io = null;

const socket = function(app) {
  io = socketio(app);

  io.on('connection', socket => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('disconnect', () => {
      //subscriptionManager.unsubscribe(socket.subscriptionId);
      console.log(`A user disconnected: ${socket.id}`);
    });

    socket.on('subscribe', token => {
      let user = jwt.decode(token, cfg.jwtSecret);
      
      if (user) {
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
      }
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
    callback: (err, { data }) => {
      if (err) 
        return console.log('questionReplied subscription error:', err);
      
      let answer = data.questionReplied;
      io.sockets.in(answer.user.id).emit('answer', answer);
    },
  });

  subscriptionManager.subscribe({
    query: `
      subscription answerCommented {
        answerCommented {
          id
          answer {
            id
            user {
              id
            }
          }
          text
          user {
            username
          }
          timestamp
        }
      }
    `,
    callback: (err, { data }) => {
      if (err) 
        return console.log('answerCommented subscription error:', err);
    
      let comment = data.answerCommented;
      io.sockets.in(comment.answer.user.id).emit('comment', comment);
    },
  });
};

module.exports = {
  socket,
  sockets,
  io
};