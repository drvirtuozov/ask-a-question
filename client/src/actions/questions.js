import axios from 'axios';
import { getGraph } from './requests';
import { setQuestionsCount } from './questionsCount';


export function addQuestion(question) {
  return {
    type: 'ADD_QUESTION',
    payload: question,
  };
}

export function addQuestions(questions) {
  return {
    type: 'ADD_QUESTIONS',
    payload: questions,
  };
}

export function setQuestions(questions) {
  return {
    type: 'SET_QUESTIONS',
    payload: questions,
  };
}

export function getAndSetQuestionsToStore() {
  return async (dispatch) => {
    const data = await getGraph(`{
      getQuestions {
        questions {
          id
          text
          from {
            username
          }
          timestamp
        }
        errors {
          detail
        }
      }
    }`);

    const questions = data.getQuestions.questions;
    dispatch(setQuestions(questions));
    dispatch(setQuestionsCount(questions.length));
  };
}

export function answerQuestion(id, text) {
  return async () => {
    const res = await getGraph(`mutation {
      answerQuestion(question_id: ${id}, text: "${text}") {
        answer {
          id
        }
        errors {
          field
          detail
        }
      }
    }`);

    return res.answerQuestion;
  };
}

export function deleteQuestion(id) {
  return async () => {
    const res = await getGraph(`mutation {
      deleteQuestion(question_id: ${id}) {
        ok
        errors {
          detail
        }
      }
    }`);

    return res.deleteQuestion;
  };
}

export function restoreQuestion(id) {
  return async () => {
    const res = await getGraph(`mutation {
      restoreQuestion(question_id: ${id}) {
        ok
        errors {
          detail
        }
      }
    }`);

    return res.restoreQuestion;
  };
}

export function createQuestion(userId, text, params = {}) {
  return async () => {
    const headers = {};
    Object.assign(headers, axios.defaults.headers);

    if (params.anonymously) headers.Authorization = '';

    const res = await axios.post('/api', {
      query: `mutation {
        createQuestion(user_id: ${userId}, text: "${text}") {
          question {
            id
          }
          errors {
            detail
          }
        }
      }`,
    }, { headers });

    return res.data.data.createQuestion;
  };
}
