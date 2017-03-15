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