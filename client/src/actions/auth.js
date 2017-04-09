import jwtDecode from 'jwt-decode';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { createUser, createToken } from '../requests/api';
import getAndSetQuestionsToStore from '../utils/getAndSetQuestionsToStore';


export function setCurrentUser(user) {
  return {
    type: 'SET_CURRENT_USER',
    user,
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('token');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}

export function signup(user) {
  return async (dispatch) => {
    const res = await createUser(user);

    if (res.token) {
      localStorage.setItem('token', res.token);
      setAuthorizationToken(res.token);
      dispatch(setCurrentUser(jwtDecode(res.token)));
      getAndSetQuestionsToStore();
    }

    return res;
  };
}

export function login(username, password) {
  return async (dispatch) => {
    const res = await createToken(username, password);

    if (res.token) {
      localStorage.setItem('token', res.token);
      setAuthorizationToken(res.token);
      dispatch(setCurrentUser(jwtDecode(res.token)));
      getAndSetQuestionsToStore();
    }

    return res;
  };
}
