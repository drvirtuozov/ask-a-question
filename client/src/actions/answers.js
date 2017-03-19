export function addAnswer(answer) {
  return {
    type: 'ADD_ANSWER',
    answer
  };
}

export function setAnswers(answers) {
  return {
    type: 'SET_ANSWERS',
    answers
  };
}

export function addAnswerComment(comment) {
  return {
    type: 'ADD_ANSWER_COMMENT',
    comment
  };
}