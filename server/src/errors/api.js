const { unauthorized, badRequest } = require('boom');
const { 
  TOKEN_NOT_PROVIDED, WRONG_PASSWORD, USER_NOT_FOUND, 
  QUESTION_NOT_FOUND, ANSWER_NOT_FOUND
} = require('../shared/formErrors');


const tokenNotProvided = payload => constructError(unauthorized(TOKEN_NOT_PROVIDED), payload);
const wrongPassword = payload => constructError(unauthorized(WRONG_PASSWORD), payload);
const userNotFound = payload => constructError(badRequest(USER_NOT_FOUND), payload);
const questionNotFound = payload => constructError(badRequest(QUESTION_NOT_FOUND), payload);
const answerNotFound = payload => constructError(badRequest(ANSWER_NOT_FOUND), payload);

function constructError(error, payload = {}) {
  let err = error.output.payload ? error.output.payload : error.output,
    output = {
      status: err.statusCode,
      title: err.error,
      detail: err.message,
    };
  
  if (Object.keys(payload).length) {
    for (let key in payload) {
      output[key] = payload[key];
    }
  }

  return output;
}

module.exports = {
  tokenNotProvided,
  wrongPassword,
  userNotFound,
  questionNotFound,
  answerNotFound
};
