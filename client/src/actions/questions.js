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
