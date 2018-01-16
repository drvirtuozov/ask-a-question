import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { TICK_MOMENT } from './types';


Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  state: {
    user: {},
    profile: {},
    isAuthenticated: false,
    questions: [],
    answers: [],
    comments: [],
    areQuestionsLoading: false,
    momentTick: Date.now(),
  },
  getters,
  mutations,
  actions,
});

setInterval(() => {
  store.commit(TICK_MOMENT, Date.now());
}, 1000 * 60);

export default store;
