const { unauthorized, badRequest } = require('boom');
const {
  TOKEN_NOT_PROVIDED, WRONG_PASSWORD, USER_NOT_FOUND,
  QUESTION_NOT_FOUND, ANSWER_NOT_FOUND,
} = require('../shared/formErrors');


function constructError(error, payload = {}) {
  const err = error.output.payload ? error.output.payload : error.output;
  const output = {
    status: err.statusCode,
    title: err.error,
    detail: err.message,
  };

  if (Object.keys(payload).length) {
    for (const key in payload) {
      output[key] = payload[key];
    }
  }

  return output;
}

const tokenNotProvided = payload => constructError(unauthorized(TOKEN_NOT_PROVIDED), payload);
const wrongPassword = payload => constructError(unauthorized(WRONG_PASSWORD), payload);
const userNotFound = payload => constructError(badRequest(USER_NOT_FOUND), payload);
const questionNotFound = payload => constructError(badRequest(QUESTION_NOT_FOUND), payload);
const answerNotFound = payload => constructError(badRequest(ANSWER_NOT_FOUND), payload);

module.exports = {
  tokenNotProvided,
  wrongPassword,
  userNotFound,
  questionNotFound,
  answerNotFound,
};
