import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';


Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  state: {
    user: {
      id: 0,
      username: '',
    },
    isAuthenticated: false,
    questions: [],
    answers: [],
  },
  getters,
  mutations,
  actions,
});

export default store;
