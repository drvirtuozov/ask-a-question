import findIndex from 'lodash/findIndex';


export default function (state = [], action) {
  switch (action.type) {
    case 'ADD_ANSWER':
      return [
        action.payload,
        ...state,
      ];

    case 'SET_ANSWERS':
      return action.payload;

    case 'ADD_ANSWER_COMMENT':
      const i = findIndex(state, { id: action.payload.answer && action.payload.answer.id });
      const answers = [...state];

      if (i !== -1) {
        if (answers[i].comments) {
          answers[i].comments.push(action.comment);
        } else {
          answers[i].comments = [action.comment];
        }

        return answers;
      }

      return state;

    default: return state;
  }
}
