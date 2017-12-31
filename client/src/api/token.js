import { postapi } from '../util';

function create(username = '', password = '') {
  return postapi('token.create', { username, password });
}

export default {
  create,
};
