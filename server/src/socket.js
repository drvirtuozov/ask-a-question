const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const cfg = require('./config');
const { subscriptionManager } = require('./api');


const sockets = new Map();

const createSocketServer = function (app) {
  const io = socketio(app);

  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('disconnect', () => {
      // subscriptionManager.unsubscribe(socket.subscriptionId);
      console.log(`A user disconnected: ${socket.id}`);
    });

    socket.on('subscribe', (token) => {
      const user = jwt.decode(token, cfg.jwtSecret);

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
          callback(err, data) {
            if (err) return console.log('questionCreated subscription error:', err);

            return socket.emit('question', data.data.questionCreated);
          },
        });
      }
    });

    socket.on('room', (room) => {
      if (socket.room) socket.leave(socket.room);

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
    callback(err, { data }) {
      if (err) return console.log('questionReplied subscription error:', err);

      const answer = data.questionReplied;
      return io.sockets.in(answer.user.id).emit('answer', answer);
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
    callback(err, { data }) {
      if (err) return console.log('answerCommented subscription error:', err);

      const comment = data.answerCommented;
      return io.sockets.in(comment.answer.user.id).emit('comment', comment);
    },
  });

  return io;
};

module.exports = {
  createSocketServer,
  sockets,
};
