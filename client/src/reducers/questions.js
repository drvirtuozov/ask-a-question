export default (state = [], action = {}) => {
  switch (action.type) {
    case 'ADD_QUESTION':
      return [
        action.payload,
        ...state,
      ];

    case 'ADD_QUESTIONS':
      return [
        ...state,
        ...action.payload,
      ];

    case 'SET_QUESTIONS':
      return action.payload;

    default: return state;
  }
};
