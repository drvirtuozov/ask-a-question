<template>
  <b-card
    v-if="!isDeleted"
    class="question">
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
      <button
        class="close"
        @click="deleteQuestion">&times;</button>
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

  <b-card
    v-else
    class="question">
    <p class="card-text">The question has been deleted. <a
      href="#"
      @click.prevent="restoreQuestion">Restore</a>
    </p>
  </b-card>
</template>

<script>
import { DELETE_QUESTION, RESTORE_QUESTION } from '../store/types';


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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      answer: '',
    };
  },
  methods: {
    async deleteQuestion() {
      await this.$store.dispatch(DELETE_QUESTION, this.id);
    },
    async restoreQuestion() {
      await this.$store.dispatch(RESTORE_QUESTION, this.id);
    },
  },
};
</script>

<style>
  .question {
    margin-top: 20px;
  }
</style>

