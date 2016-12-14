import axios from 'axios';

export function getQuestions() {
  return dispatch => {
    return axios.get('api/questions');
  };
}