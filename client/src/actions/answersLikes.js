import { getGraph } from './requests';


export function incrementAnswerLikes(id) {
  return {
    type: 'INCREMENT_ANSWER_LIKES',
    payload: {
      id,
    },
  };
}

export function decrementAnswerLikes(id) {
  return {
    type: 'DECREMENT_ANSWER_LIKES',
    payload: {
      id,
    },
  };
}

export function setAnswerLikes(id, count) {
  return {
    type: 'SET_ANSWER_LIKES',
    payload: {
      id,
      count,
    },
  };
}

export function likeAnswer(id) {
  return async (dispatch) => {
    const res = await getGraph(`mutation {
      likeAnswer(answer_id: ${id}) {
        ok
        errors {
          detail
        }
      }
    }`);

    if (res.likeAnswer.ok) {
      dispatch(incrementAnswerLikes(id));
    }

    return res.likeAnswer;
  };
}

export function unlikeAnswer(id) {
  return async (dispatch) => {
    const res = await getGraph(`mutation {
      unlikeAnswer(answer_id: ${id}) {
        ok
        errors {
          detail
        }
      }
    }`);

    if (res.unlikeAnswer.ok) {
      dispatch(decrementAnswerLikes(id));
    }

    return res.unlikeAnswer;
  };
}
