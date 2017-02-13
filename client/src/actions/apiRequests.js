import axios from 'axios';

export function createUser(user) {
  return dispatch => {
    return axios.post('/api', {
      query: `{ mutation users(
        username: "${user.username}",
        password: "${user.password}",
        email: "${user.email}"
      ) { username } }`
    });
  };
}

export function isUserExists(username) {
  return async dispatch => {
    let res = await axios.post('/api', { query: `{ users(username:"${username}") { username } }` });
    return res.data.data.users.length ? true : false;
  };
}