import jwtDecode from 'jwt-decode';
import {
  CREATE_SET_TOKEN, REMOVE_UNSET_TOKEN, GET_SET_QUESTIONS, DELETE_QUESTION, RESTORE_QUESTION,
  DESTROY_QUESTION, SET_USER, SET_QUESTIONS, REPLY_QUESTION, GET_PROFILE, SET_QUESTIONS_LOADING,
  GET_ANSWERS, GET_SET_COMMENTS, SET_COMMENTS, CREATE_COMMENT, LIKE_ANSWER, UNLIKE_ANSWER,
  CREATE_QUESTION, CREATE_SET_USER, JOIN_ROOM, SET_ALERT,
} from './types';
import token from '../api/token';
import user from '../api/user';
import question from '../api/question';
import answer from '../api/answer';
import comment from '../api/comment';
import likes from '../api/likes';
import socket from '../socket';


export default {
  async [CREATE_SET_USER](ctx, {
    firstName, username, email, password,
  }) {
    const tkn = await user.create(firstName, username, email, password);
    const usr = jwtDecode(tkn);
    localStorage.setItem('token', tkn);
    ctx.commit(SET_USER, usr);
    socket.send(JSON.stringify({
      type: 'SET_TOKEN',
      payload: tkn,
    }));
    ctx.commit(SET_ALERT, {
      text: 'Well done! You have successfully signed up. Now, wait a sec for some questions...',
    });
  },
  async [CREATE_SET_TOKEN](ctx, { username, password }) {
    const tkn = await token.create(username, password);
    const usr = jwtDecode(tkn);
    localStorage.setItem('token', tkn);
    ctx.commit(SET_USER, usr);
    ctx.dispatch(GET_SET_QUESTIONS);
    socket.send(JSON.stringify({
      type: 'SET_TOKEN',
      payload: tkn,
    }));
  },
  async [REMOVE_UNSET_TOKEN](ctx) {
    localStorage.removeItem('token');
    ctx.commit(SET_USER);
    ctx.commit(SET_QUESTIONS);
    socket.send(JSON.stringify({
      type: 'SET_TOKEN',
    }));
  },
  async [GET_SET_QUESTIONS](ctx) {
    ctx.commit(SET_QUESTIONS_LOADING, true);
    const questions = await user.getQuestions();
    ctx.commit(SET_QUESTIONS_LOADING, false);
    ctx.commit(SET_QUESTIONS, questions);
    return questions;
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
  [GET_PROFILE](ctx, username) {
    return user.get(username);
  },
  [GET_ANSWERS](ctx, userId) {
    return user.getAnswers(userId);
  },
  async [GET_SET_COMMENTS](ctx, answerId) {
    const comments = await answer.getComments(answerId);
    ctx.commit(SET_COMMENTS, {
      answerId,
      comments,
    });
    return comments;
  },
  [CREATE_COMMENT](ctx, { answerId, text }) {
    return comment.create(answerId, text);
  },
  [LIKE_ANSWER](ctx, answerId) {
    return likes.create(answerId);
  },
  [UNLIKE_ANSWER](ctx, answerId) {
    return likes.Delete(answerId);
  },
  [CREATE_QUESTION](ctx, payload) {
    return question.create(payload.userId, payload.text, payload.anon);
  },
  [JOIN_ROOM](ctx, roomId) {
    socket.send(JSON.stringify({
      type: JOIN_ROOM,
      payload: roomId,
    }));
  },
};
