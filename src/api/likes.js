import { postapi } from '../util';


async function create(answerId) {
  const res = await postapi('likes.create', { answer_id: answerId });
  return res.data;
}

async function Delete(answerId) {
  const res = await postapi('likes.delete', { answer_id: answerId });
  return res.data;
}

export default {
  create,
  Delete,
};
