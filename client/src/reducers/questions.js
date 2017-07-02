import findIndex from 'lodash/findIndex';


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

    case 'SET_QUESTION_STATE':
      const i = findIndex(state, { id: action.payload.id });
      const questions = [...state];

      if (i !== -1) {
        questions[i].state = action.payload.state;
        return questions;
      }

      return state;

    default: return state;
  }
};
