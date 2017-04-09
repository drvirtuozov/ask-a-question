export function addQuestion(question) {
  return {
    type: 'ADD_QUESTION',
    question,
  };
}

export function addQuestions(questions) {
  return {
    type: 'ADD_QUESTIONS',
    questions,
  };
}

export function setQuestions(questions) {
  return {
    type: 'SET_QUESTIONS',
    questions,
  };
}
