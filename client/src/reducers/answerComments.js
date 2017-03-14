export default function(state = [], action) {
  switch(action.type) {    
    case 'ADD_ANSWER_COMMENT':
      return [
        ...state,
        action.comment
      ];

    default: return state;
  }
}