export default {
  getQuestions(state) {
    return state.questions;
  },
  getQuestionsCount(state, getters) {
    return getters.getQuestions.length;
  },
};
