import axios from 'axios';


export function apiErrorsToState(errors) {
  const output = {};

  for (const e of errors) {
    output[e.field] = e.detail;
  }

  return output;
}

export function setRequestAuthorizationToken(token) {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}
