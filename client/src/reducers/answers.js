export default function(state = [], action) {
  switch(action.type) {
    case 'ADD_ANSWER':
      return [
        action.answer,
        ...state
      ];

    case 'SET_ANSWERS':
      return action.answers;

    default: return state;
  }
}