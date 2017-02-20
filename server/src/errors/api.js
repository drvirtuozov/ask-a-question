import { unauthorized, badRequest } from 'boom';
import { 
  TOKEN_NOT_PROVIDED, WRONG_PASSWORD, USER_NOT_FOUND, 
  QUESTION_NOT_FOUND, ANSWER_NOT_FOUND
} from '../shared/formErrors';


export const tokenNotProvided = payload => constructError(unauthorized(TOKEN_NOT_PROVIDED), payload);
export const wrongPassword = payload => constructError(unauthorized(WRONG_PASSWORD), payload);
export const userNotFound = payload => constructError(badRequest(USER_NOT_FOUND), payload);
export const questionNotFound = payload => constructError(badRequest(QUESTION_NOT_FOUND), payload);
export const answerNotFound = payload => constructError(badRequest(ANSWER_NOT_FOUND), payload);

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