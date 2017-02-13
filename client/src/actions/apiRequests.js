import axios from 'axios';

export function userSignupRequest(userData) {
  return dispatch => {
    return axios.post('/api/users', userData);
  };
}

export function isUserExists(username) {
  return async dispatch => {
    let res = await axios.post('/api', { query: `{ users(username:"${username}") { username } }` });
    return res.data.data.users.length ? true : false;
  };
}