export default {
  getUser(state) {
    return state.user;
  },
  getQuestions(state) {
    return state.questions;
  },
  getQuestionsCount(state, getters) {
    return getters.getQuestions.length;
  },
};
