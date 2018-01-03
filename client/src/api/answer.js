import { postapi } from '../util';


async function create(questionID, text) {
  const res = await postapi('answer.create', {
    question_id: questionID,
    text,
  });
  return res.data;
}

export default {
  create,
};
