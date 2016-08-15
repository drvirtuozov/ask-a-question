import axios from 'axios';

export function userSignupRequest(userData) {
  console.log("making request", userData);
  return dispatch => {
    return axios.post('/api/users', userData);
  };
}