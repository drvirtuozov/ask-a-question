<template>
  <div class="col-xl-6">
    <span v-if="isLoading">Loading...</span>
    <div v-else-if="questionCount">
      <h4 v-if="questionCount == 1">There's a question especially for you:</h4>
      <h4 v-else>There are {{ questionCount }} questions especially for you:</h4>
      <hr>
    </div>
    <h3
      v-else
      class="text-muted text-center">You haven't received a single question yet</h3>
    <question
      v-for="question in questions"
      :key="question.id"
      :id="question.id"
      :text="question.text"
      :timestamp="question.timestamp"
      :from="question.from"
      :is-deleted="question.isDeleted" />
  </div>
</template>

<script>
import Question from './Question.vue';


export default {
  name: 'Questions',
  components: { Question },
  computed: {
    isLoading() {
      return this.$store.state.areQuestionsLoading;
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    questions() {
      return this.$store.getters.getQuestions;
    },
    questionCount() {
      return this.$store.getters.getQuestionCount;
    },
  },
  watch: {
    isAuthenticated() {
      this.$router.push('/');
    },
  },
};
</script>

