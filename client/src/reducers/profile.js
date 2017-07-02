import isEmpty from 'lodash/isEmpty';


const initialState = {
  user: {},
  isUserExists: true,
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_CURRENT_PROFILE':
      return {
        user: action.payload,
        isUserExists: !isEmpty(action.payload),
      };

    default: return state;
  }
}
