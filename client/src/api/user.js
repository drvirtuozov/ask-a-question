import { postapi } from '../util';


async function getQuestions() {
  const res = await postapi('user.getQuestions');
  return res.data;
}

export default {
  getQuestions,
};
