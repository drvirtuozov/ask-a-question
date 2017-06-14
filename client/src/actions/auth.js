import jwtDecode from 'jwt-decode';
import { setRequestAuthorizationToken } from '../helpers/utils';
import { getGraph } from './requests';
import { setQuestions, getAndSetQuestionsToStore } from './questions';
import { setQuestionsCount } from './questionsCount';


export function setCurrentUser(user) {
  return {
    type: 'SET_CURRENT_USER',
    payload: user,
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('token');
    setRequestAuthorizationToken(false);
    dispatch(setCurrentUser({}));
    dispatch(setQuestions([]));
    dispatch(setQuestionsCount(0));
  };
}

export function signup(user) {
  return async (dispatch) => {
    const data = await getGraph(`
      mutation {
        createUser(username: "${user.username}", password: "${user.password}", email: "${user.email}") {
          token
          errors {
            field
            detail
          }
        }
      }
    `);

    const token = data.createUser.token;

    if (token) {
      localStorage.setItem('token', token);
      setRequestAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
    }

    return data.createUser;
  };
}

export function login(username, password) {
  return async (dispatch) => {
    const data = await getGraph(`
      mutation {
        createToken(username: "${username}", password: "${password}") {
          token
          errors {
            field
            detail
          }
        }
      }
    `);

    const token = data.createToken.token;

    if (token) {
      localStorage.setItem('token', token);
      setRequestAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
      dispatch(getAndSetQuestionsToStore());
    }

    return data.createToken;
  };
}
