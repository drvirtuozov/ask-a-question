import {
  SET_QUESTIONS, DELETE_QUESTION, RESTORE_QUESTION, DESTROY_QUESTION, SET_ANSWERS,
  SET_COMMENTS, INC_ANSWER_COMMENT_COUNT,
} from './store/types';
import store from './store';

const wsProtocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
const ws = new WebSocket(`${wsProtocol}://${location.host}/ws`);

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

  switch (event.type) {
    case 'QUESTION_CREATED': {
      const questions = store.getters.getQuestions;
      questions.unshift(event.payload);
      store.commit(SET_QUESTIONS, questions);
      break;
    }
    case 'QUESTION_DELETED': {
      const id = event.payload;
      store.commit(DELETE_QUESTION, id);
      break;
    }
    case 'QUESTION_RESTORED': {
      const id = event.payload;
      store.commit(RESTORE_QUESTION, id);
      break;
    }
    case 'QUESTION_DESTROYED': {
      const id = event.payload;
      store.commit(DESTROY_QUESTION, id);
      break;
    }
    case 'ANSWER_CREATED': {
      const answers = store.getters.getAnswers.slice(0);
      answers.unshift(event.payload);
      store.commit(SET_ANSWERS, answers);
      break;
    }
    case 'COMMENT_CREATED': {
      const answer = store.getters.getAnswerById(event.payload.answer_id);
      const comments = store.getters.getCommentsByAnswerId(answer.id);

      if (comments.length === 0 && answer.comment_count > 0) {
        store.commit(INC_ANSWER_COMMENT_COUNT, answer.id);
      } else {
        comments.push(event.payload);
        store.commit(SET_COMMENTS, {
          answerId: answer.id,
          comments,
        });
      }

      break;
    }
    default:
      console.error('Unimplemented socket event:', event.type);
  }
};

export default ws;
