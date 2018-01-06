<template>
  <div class="card container">
    <form @submit.prevent="ask">
      <b-form-group label="Ask me whatever you want:">
        <b-form-input
          type="text"
          v-model="question"
          required
          placeholder="Enter a question..." />
      </b-form-group>
      <b-form-group>
        <b-button variant="primary">Ask</b-button>
        <b-form-checkbox
          class="mb-2 mr-sm-2 mb-sm-0"
          v-model="isAnon"
          v-if="isAuthenticated">Anonymously</b-form-checkbox>
      </b-form-group>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Ask',
  data() {
    return {
      isAnon: false,
      question: '',
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    ask() {},
  },
};
</script>

