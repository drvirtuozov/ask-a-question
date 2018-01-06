import { postapi } from '../util';


async function get(username = '') {
  const res = await postapi('user.get', { username });
  return res.data;
}

async function getQuestions() {
  const res = await postapi('user.getQuestions');
  return res.data;
}

async function getAnswers(userId) {
  const res = await postapi('user.getAnswers', { user_id: userId });
  return res.data;
}

export default {
  get,
  getQuestions,
  getAnswers,
};
