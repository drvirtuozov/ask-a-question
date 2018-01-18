<template>
  <b-card
    v-if="!isAsked"
    class="ask">
    <form @submit.prevent="ask">
      <b-form-group label="Ask me whatever you want:">
        <b-form-input
          type="text"
          v-model="question"
          required
          placeholder="Enter a question..." />
      </b-form-group>
      <b-button
        variant="primary"
        :disabled="!question"
        type="submit">Ask</b-button>
      <b-form-checkbox
        class="mb-2 mr-sm-2 mb-sm-0"
        v-model="isAnon"
        v-if="isAuthenticated">Anonymously</b-form-checkbox>
    </form>
  </b-card>

  <b-card
    v-else
    border-variant="success"
    class="ask text-center">
    <span>
      Success! <strong>{{ profile.username }}</strong> has just received your question.
      <a
        @click.prevent="setNasked"
        href="#">Ask another question</a>
    </span>
  </b-card>
</template>

<script>
import { CREATE_QUESTION } from '../store/types';


export default {
  name: 'Ask',
  data() {
    return {
      isAnon: !this.isAuthenticated,
      isAsked: false,
      question: '',
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    profile() {
      return this.$store.getters.getProfile;
    },
  },
  methods: {
    setNasked() {
      this.isAsked = !this.isAsked;
    },
    async ask() {
      await this.$store.dispatch(CREATE_QUESTION, {
        userId: this.profile.id,
        text: this.question,
        anon: this.isAnon,
      });
      this.question = '';
      this.setNasked();
    },
  },
};
</script>

<style>
  .ask {
    margin-bottom: 20px;
  }
</style>

