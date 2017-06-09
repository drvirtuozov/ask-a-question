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

export function addAnswerComment(comment) {
  return {
    type: 'ADD_ANSWER_COMMENT',
    payload: comment,
  };
}
