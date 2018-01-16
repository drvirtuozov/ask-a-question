import {
  SET_QUESTIONS, DELETE_QUESTION, RESTORE_QUESTION, DESTROY_QUESTION, SET_ANSWERS,
  SET_COMMENTS,
} from './store/types';
import store from './store';


const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected to websocket server');

  if (localStorage.getItem('token')) {
    ws.send(JSON.stringify({
      type: 'SET_TOKEN',
      payload: localStorage.getItem('token'),
    }));
  }
};

ws.onclose = () => {
  console.log('Disconnected from websocket server');
};

ws.onmessage = (e) => {
  console.log('Got event:', e.data);
  const event = JSON.parse(e.data);
  let questions;
  let answers;
  let comments;
  let id;

  switch (event.type) {
    case 'QUESTION_CREATED':
      questions = store.getters.getQuestions;
      questions.unshift(event.payload);
      store.commit(SET_QUESTIONS, questions);
      break;
    case 'QUESTION_DELETED':
      id = event.payload;
      store.commit(DELETE_QUESTION, id);
      break;
    case 'QUESTION_RESTORED':
      id = event.payload;
      store.commit(RESTORE_QUESTION, id);
      break;
    case 'QUESTION_DESTROYED':
      id = event.payload;
      store.commit(DESTROY_QUESTION, id);
      break;
    case 'ANSWER_CREATED':
      answers = store.getters.getAnswers.slice(0);
      answers.unshift(event.payload);
      store.commit(SET_ANSWERS, answers);
      break;
    case 'COMMENT_CREATED':
      comments = store.getters.getCommentsByAnswerId(event.payload.answer_id);
      comments.push(event.payload);
      store.commit(SET_COMMENTS, {
        answerId: event.payload.answer_id,
        comments,
      });
      break;
    default:
      console.error('Unimplemented socket event:', event.type);
  }
};

export default ws;
