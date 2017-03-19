import findIndex from 'lodash/findIndex';


export default function(state = [], action) {
  switch(action.type) {
    case 'ADD_ANSWER':
      return [
        action.answer,
        ...state
      ];

    case 'SET_ANSWERS':
      return action.answers;

    case 'ADD_ANSWER_COMMENT':
      let { comment } = action,
        i = findIndex(state, { id: comment.answer && comment.answer.id }),
        newState = [ ...state ];

      if (i !== -1) {
        if (newState[i].comments) {
          newState[i].comments.push(action.comment);
        } else {
          newState[i].comments = [action.comment];
        }

        return newState;
      }

    default: return state;
  }
}