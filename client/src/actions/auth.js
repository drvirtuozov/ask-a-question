import jwtDecode from 'jwt-decode';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { grapqlQuery } from './requests';
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
    const data = await grapqlQuery(`
      mutation { 
        user {
          create(
            username: "${user.username}",
            password: "${user.password}",
            email: "${user.email}"
          ) { 
            token 
            errors {
              field
              detail
            }
          } 
        }
      }
    `);

    if (data.token) {
      localStorage.setItem('token', data.token);
      setAuthorizationToken(data.token);
      dispatch(setCurrentUser(jwtDecode(data.token)));
      getAndSetQuestionsToStore();
    }

    return data;
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
