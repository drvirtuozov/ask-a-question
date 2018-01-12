import { SET_QUESTIONS, DELETE_QUESTION, RESTORE_QUESTION } from './store/types';
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
  console.log('Got message:', e.data);
  const event = JSON.parse(e.data);
  let question;
  let questions;

  switch (event.type) {
    case 'QUESTION_CREATED':
      questions = store.getters.getQuestions.slice(0);
      questions.unshift(event.payload);
      store.commit(SET_QUESTIONS, questions);
      break;
    case 'QUESTION_DELETED':
      question = event.payload;
      store.commit(DELETE_QUESTION, question.id);
      break;
    case 'QUESTION_RESTORED':
      question = event.payload;
      store.commit(RESTORE_QUESTION, question.id);
      break;
    default:
      console.log('Unimplemented action:', event.type);
  }
};
