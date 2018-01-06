import jwtDecode from 'jwt-decode';
import {
  LOGIN, LOGOUT, GET_QUESTIONS, DELETE_QUESTION, RESTORE_QUESTION, DESTROY_QUESTION,
  SET_USER, SET_QUESTIONS, REPLY_QUESTION, GET_PROFILE, SET_PROFILE, SET_QUESTIONS_LOADING,
  GET_ANSWERS, SET_ANSWERS,
} from './types';
import token from '../api/token';
import user from '../api/user';
import question from '../api/question';
import answer from '../api/answer';


export default {
  async [LOGIN](ctx, { username, password }) {
    const tkn = await token.create(username, password);
    const usr = jwtDecode(tkn);
    localStorage.setItem('token', tkn);
    ctx.commit(SET_USER, usr);
    ctx.dispatch(GET_QUESTIONS);
  },
  async [LOGOUT](ctx) {
    localStorage.removeItem('token');
    ctx.commit(SET_USER);
    ctx.commit(SET_QUESTIONS);
  },
  async [GET_QUESTIONS](ctx) {
    ctx.commit(SET_QUESTIONS_LOADING, true);
    const questions = await user.getQuestions();
    ctx.commit(SET_QUESTIONS_LOADING, false);
    ctx.commit(SET_QUESTIONS, questions);
  },
  async [DELETE_QUESTION](ctx, id) {
    await question.Delete(id);
    ctx.commit(DELETE_QUESTION, id);
  },
  async [RESTORE_QUESTION](ctx, id) {
    await question.restore(id);
    ctx.commit(RESTORE_QUESTION, id);
  },
  async [REPLY_QUESTION](ctx, payload) {
    await answer.create(payload.id, payload.text);
    ctx.commit(DESTROY_QUESTION, payload.id);
  },
  async [GET_PROFILE](ctx, username) {
    const profile = await user.get(username);
    ctx.commit(SET_PROFILE, profile);
  },
  async [GET_ANSWERS](ctx, userId) {
    const answers = await user.getAnswers(userId);
    ctx.commit(SET_ANSWERS, answers);
  },
};
