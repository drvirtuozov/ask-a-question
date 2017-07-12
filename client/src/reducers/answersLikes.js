export default function (state = {}, action = {}) {
  const newState = Object.assign(state);

  switch (action.type) {
    case 'INCREMENT_ANSWER_LIKES':
      newState[action.payload.id] = state[action.payload.id] + 1;
      return newState;

    case 'DECREMENT_ANSWER_LIKES':
      newState[action.payload.id] = state[action.payload.id] - 1;
      return newState;

    case 'SET_ANSWER_LIKES':
      newState[action.payload.id] = action.payload.count || 0;
      return newState;

    default: return state;
  }
}
