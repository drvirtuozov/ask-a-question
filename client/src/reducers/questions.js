export default (state = [], action = {}) => {
  switch(action.type) {
    case 'ADD_QUESTION':
      return [
        action.question,
        ...state
      ];
    
    case 'ADD_QUESTIONS':
      return [
        ...state,
        ...action.questions
      ];

    case 'SET_QUESTIONS':
      return action.questions;
      
    default: return state;
  }
};