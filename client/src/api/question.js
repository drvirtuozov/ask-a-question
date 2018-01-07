import { postapi } from '../util';


async function Delete(id) {
  const res = await postapi('question.delete', { id });
  return res.data;
}

async function restore(id) {
  const res = await postapi('question.restore', { id });
  return res.data;
}

async function create(userId, text, anon) {
  const res = await postapi('question.create', {
    user_id: userId,
    text,
    anon,
  });
  return res.data;
}

export default {
  Delete,
  restore,
  create,
};
