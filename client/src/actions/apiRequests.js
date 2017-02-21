import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER } from './types';
import { setCurrentUser } from './authActions';


export function createUser(user) {
  return async dispatch => {
    let res = await axios.post('/api', {
      query: `
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
      `
    }),
      result = res.data.data.user.create;

    if (result.token) {
      localStorage.setItem('token', result.token);
      setAuthorizationToken(result.token);
      dispatch(setCurrentUser(jwtDecode(result.token)));
    }

    return result;
  };
}

export function isUserExists(username) {
  return async dispatch => {
    let res = await axios.post('/api', { 
      query: `{ 
        user(username: "${username}") { 
          user {
            username
          }
          errors {
            field
            detail
          }
        } 
      }` 
    });

    return res.data.data.user.user ? true : false;
  };
}

export function createToken(username, password) {
  return async dispatch => {
    let res = await axios.post('/api', { 
      query: `
        mutation {
          token {
            create(username: "${username}", password: "${password}") {
              token
              errors {
                field
                detail
              }
            }
          }
        }
      `
    }),
      result = res.data.data.token.create;
    
    if (result.token) {
      localStorage.setItem('token', result.token);
      setAuthorizationToken(result.token);
      dispatch(setCurrentUser(jwtDecode(result.token)));
    }

    return result;
  };
}