import { postapi } from '../util';


async function create(questionId, text) {
  const res = await postapi('answer.create', {
    question_id: questionId,
    text,
  });
  return res.data;
}

async function getComments(answerId) {
  const res = await postapi('answer.getComments', {
    answer_id: answerId,
  });
  return res.data;
}

export default {
  create,
  getComments,
};
