import { postapi } from '../util';


async function create(answerId, text) {
  const res = await postapi('comment.create', {
    answer_id: answerId,
    text,
  });
  return res.data;
}

export default {
  create,
};
