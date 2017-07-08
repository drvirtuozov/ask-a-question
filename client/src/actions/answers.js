import { getGraph } from './requests';


export function addAnswer(answer) {
  return {
    type: 'ADD_ANSWER',
    payload: answer,
  };
}

export function setAnswers(answers) {
  return {
    type: 'SET_ANSWERS',
    payload: answers,
  };
}

export function addAnswerComment(id, comment) {
  return {
    type: 'ADD_ANSWER_COMMENT',
    payload: {
      id,
      comment,
    },
  };
}

export function getAnswers(id) {
  return async () => {
    const res = await getGraph(`{
      getAnswers(user_id: ${id}) {
        answers {
          id
          text
          question {
            text
            from {
              username
            }
          }
          likes {
            username
          }
          comments {
            id
            user {
              username
            }
            text
            timestamp
          }
          timestamp
        }
        errors {
          detail
        }
      }
    }`);

    return res.getAnswers;
  };
}

export function commentAnswer(id, text) {
  return async () => {
    const res = await getGraph(`mutation {
      commentAnswer(answer_id: ${id}, text: "${text}") {
        comment {
          id
          text
          user {
            username
          }
          timestamp
        }
        errors {
          detail
        }
      }
    }`);

    return res.commentAnswer;
  };
}

export function setAnswerState(id, state) {
  return {
    type: 'SET_ANSWER_STATE',
    payload: {
      id,
      state,
    },
  };
}
