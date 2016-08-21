import axios from 'axios';

export function getAnswers(username) {
  return dispatch => {
    return axios.get(`api/answers/${username}`);
  };
}

export function reply(question) {
  return dispatch => {
    return axios.post('api/answers', question);
  };
}