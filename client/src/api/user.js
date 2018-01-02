import { postapi } from '../util';


async function getQuestions(token) {
  const res = await postapi('user.getQuestions', null, token);
  return res.data;
}

export default {
  getQuestions,
};
