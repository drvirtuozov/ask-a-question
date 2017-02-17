import { unauthorized, badRequest } from 'boom';


export const tokenNotProvided = payload => constructError(unauthorized('Token not provided'), payload);
export const wrongPassword = payload => constructError(unauthorized('Wrong password'), payload);
export const userNotFound = payload => constructError(badRequest('User not found'), payload);
export const questionNotFound = payload => constructError(badRequest('Question not found'), payload);
export const answerNotFound = payload => constructError(badRequest('Answer not found'), payload);

function constructError(error, payload) {
  let err = error.output.payload ? error.output.payload : error.output;

  return {
    field: payload.field,
    status: err.statusCode,
    title: err.error,
    detail: err.message,
  };
}