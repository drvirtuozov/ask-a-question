import socketio from 'socket.io-client';
import { store } from './components/App';
import { addQuestion } from './actions/questions';
import { incrementQuestionsCount } from './actions/questionsCount';


const socket = socketio();

socket.emit('subscribe', localStorage.token);

socket.on('question', question => {
  store.dispatch(addQuestion(question));
  store.dispatch(incrementQuestionsCount());
});