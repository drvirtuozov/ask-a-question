import findIndex from 'lodash/findIndex';


export default function (state = [], action) {
  let i = -1;
  let answers = [];

  switch (action.type) {
    case 'ADD_ANSWER':
      return [
        action.payload,
        ...state,
      ];

    case 'SET_ANSWERS':
      return action.payload;

    case 'ADD_ANSWER_COMMENT':
      i = findIndex(state, { id: action.payload.id });
      answers = [...state];

      if (i !== -1) {
        if (answers[i].comments) {
          answers[i].comments.push(action.payload.comment);
        } else {
          answers[i].comments = [action.payload.comment];
        }

        return answers;
      }

      return state;

    case 'SET_ANSWER_STATE':
      i = findIndex(state, { id: action.payload.id });
      answers = [...state];

      if (i !== -1) {
        answers[i].state = answers[i].state || {};

        for (const key in action.payload.state) {
          answers[i].state[key] = action.payload.state[key];
        }
        //answers[i].state = action.payload.state;
        return answers;
      }

      return state;

    default: return state;
  }
}
