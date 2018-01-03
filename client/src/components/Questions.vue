<template>
  <div class="col-xl-6">
    <span v-if="isLoading">Loading...</span>
    <question
      v-else-if="questions.length"
      v-for="question in questions"
      :key="question.id"
      :id="question.id"
      :text="question.text"
      :timestamp="question.timestamp"
      :from="question.from" />
    <h1 v-else>There are no any questions yet</h1>
  </div>
</template>

<script>
import Question from './Question.vue';


export default {
  name: 'Questions',
  components: { Question },
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    questions() {
      return this.$store.getters.getQuestions;
    },
  },
  watch: {
    isAuthenticated() {
      this.$router.push('/');
    },
  },
  methods: {
    async getQuestions() {
      await this.$store.dispatch('getQuestions', localStorage.getItem('token'));
      this.isLoading = false;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.getQuestions());
  },
};
</script>

