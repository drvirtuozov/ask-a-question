<template>
  <b-card class="question">
    <div slot="header">
      <div class="d-inline-flex">
        <router-link
          v-if="from.id"
          :to="from.username">{{ from.username }}</router-link>
        <span
          v-else
          class="text-muted">Anonymous</span>
        <time
          :title="timestamp"
          class="text-muted">&nbsp;{{ timestamp }}</time>
      </div>
      <button class="close">&times;</button>
    </div>
    <p class="card-text">{{ text }}</p>
    <b-form>
      <b-form-group>
        <b-form-textarea
          v-model="answer"
          placeholder="Type your answer..."
          rows="3"
          max-rows="6" />
      </b-form-group>
      <b-button>Reply</b-button>
    </b-form>
  </b-card>
</template>

<script>
export default {
  name: 'Question',
  props: {
    id: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
    },
    from: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      answer: '',
    };
  },
};
</script>
<style>
  .question {
    margin-top: 20px;
  }
</style>

