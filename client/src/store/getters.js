export default {
  getUser(state) {
    return state.user;
  },
  getQuestions(state) {
    return state.questions;
  },
  getQuestionCount(state, getters) {
    return getters.getQuestions.filter(q => !q.isDeleted).length;
  },
};
