import { postapi } from '../util';


async function Delete(id) {
  const res = await postapi('question.delete', { id });
  return res.data;
}

async function restore(id) {
  const res = await postapi('question.restore', { id });
  return res.data;
}

export default {
  Delete,
  restore,
};
