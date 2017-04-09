export function incrementQuestionsCount() {
  return {
    type: 'INCREMENT_QUESTIONS_COUNT',
  };
}

export function decrementQuestionsCount() {
  return {
    type: 'DECREMENT_QUESTIONS_COUNT',
  };
}

export function setQuestionsCount(count) {
  return {
    type: 'SET_QUESTIONS_COUNT',
    count,
  };
}
