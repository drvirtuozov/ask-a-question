import { postapi } from '../util';

async function create(username = '', password = '') {
  const res = await postapi('token.create', { username, password });
  return res.data;
}

export default {
  create,
};
