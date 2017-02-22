import { combineReducers } from 'redux';
import flashMessages from './flashMessages';
import auth from './auth';
import questions from './questions';


export default combineReducers({
  flashMessages,
  auth,
  questions
});
