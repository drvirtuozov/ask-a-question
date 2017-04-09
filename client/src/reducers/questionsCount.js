export default (state = 0, action = {}) => {
  switch (action.type) {
    case 'INCREMENT_QUESTIONS_COUNT':
      return state + 1;

    case 'DECREMENT_QUESTIONS_COUNT':
      return state - 1;

    case 'SET_QUESTIONS_COUNT':
      return action.count;

    default: return state;
  }
};
