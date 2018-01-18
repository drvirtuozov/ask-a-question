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
          :title="moment.calendar()"
          class="text-muted">&nbsp;{{ moment.fromNow() }}</time>
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
      <b-button
        @click="reply"
        :disabled="!answer">Reply</b-button>
    </b-form>
  </b-card>

  <b-card
    v-else
    class="question">
    <p class="card-text text-center">The question has been deleted. <a
      href="#"
      @click.prevent="restoreQuestion">Restore</a>
    </p>
  </b-card>
</template>

<script>
import moment from 'moment';
import { DELETE_QUESTION, RESTORE_QUESTION, REPLY_QUESTION } from '../store/types';


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
      moment: this.getMoment(),
    };
  },
  computed: {
    momentTick() {
      return this.$store.state.momentTick;
    },
  },
  watch: {
    momentTick() {
      this.moment = this.getMoment();
    },
  },
  methods: {
    getMoment() {
      return moment.unix(this.timestamp);
    },
    deleteQuestion() {
      this.$store.dispatch(DELETE_QUESTION, this.id);
    },
    restoreQuestion() {
      this.$store.dispatch(RESTORE_QUESTION, this.id);
    },
    reply() {
      this.$store.dispatch(REPLY_QUESTION, {
        id: this.id,
        text: this.answer,
      });
    },
  },
};
</script>

<style>
  .question {
    margin-bottom: 20px;
  }
</style>

