import { combineReducers } from 'redux';
import flashMessages from './flashMessages';
import auth from './auth';
import questions from './questions';
import questionsCount from './questionsCount';
import answers from './answers';
import profile from './profile';


export default combineReducers({
  flashMessages,
  auth,
  questions,
  questionsCount,
  answers,
  profile,
});
