import Vue from 'vue';
import {
  DELETE_QUESTION, RESTORE_QUESTION, SET_USER, SET_QUESTIONS, DESTROY_QUESTION, TICK_MOMENT,
  SET_PROFILE, SET_QUESTIONS_LOADING, SET_ANSWERS,
} from './types';

function alterQuestion(state, id, key = '', value) {
  const questions = state.questions.map((q) => {
    if (q.id === id) {
      Vue.set(q, key, value);
    }

    return q;
  });

  Vue.set(state, 'questions', questions);
}

export default {
  [SET_USER](state, user) {
    Vue.set(state, 'user', user || {});
    Vue.set(state, 'isAuthenticated', !!user);
  },
  [SET_QUESTIONS](state, questions) {
    Vue.set(state, 'questions', questions || []);
  },
  [DELETE_QUESTION](state, id) {
    alterQuestion(state, id, 'isDeleted', true);
  },
  [RESTORE_QUESTION](state, id) {
    alterQuestion(state, id, 'isDeleted', false);
  },
  [DESTROY_QUESTION](state, id) {
    Vue.set(state, 'questions', state.questions.filter(q => q.id !== id));
  },
  [TICK_MOMENT](state, ms) {
    Vue.set(state, 'momentTick', ms);
  },
  [SET_PROFILE](state, profile) {
    Vue.set(state, 'profile', profile || {});
  },
  [SET_QUESTIONS_LOADING](state, payload) {
    Vue.set(state, 'areQuestionsLoading', !!payload);
  },
  [SET_ANSWERS](state, answers) {
    Vue.set(state.profile, 'answers', answers);
  },
};
