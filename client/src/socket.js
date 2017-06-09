/* import socketio from 'socket.io-client';
import { store } from './components/App';
import { addQuestion } from './actions/questions';
import { incrementQuestionsCount, decrementQuestionsCount } from './actions/questionsCount';
import { addAnswer, addAnswerComment } from './actions/answers';


const socket = socketio();

socket.emit('subscribe', localStorage.token);

socket.on('question', (question) => {
  store.dispatch(addQuestion(question));
  store.dispatch(incrementQuestionsCount());
});

socket.on('answer', (answer) => {
  store.dispatch(addAnswer(answer));

  if (store.getState().auth.user.id === answer.user.id) {
    store.dispatch(decrementQuestionsCount());
  }
});

socket.on('comment', (comment) => {
  store.dispatch(addAnswerComment(comment));
});

export default socket; */
