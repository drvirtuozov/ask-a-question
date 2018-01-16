export default {
  getUser(state) {
    return state.user;
  },
  getQuestions(state) {
    return state.questions.slice(0);
  },
  getQuestionCount(state, getters) {
    return getters.getQuestions.filter(q => !q.isDeleted).length;
  },
  getProfile(state) {
    return state.profile;
  },
  getAnswers(state) {
    return state.answers.slice(0);
  },
  getCommentsByAnswerId(state) {
    return answerId => (state.comments[answerId] || []).slice(0);
  },
};
