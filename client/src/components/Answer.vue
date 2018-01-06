<template>
  <b-card
    :title="question.text"
    class="answer">
    <div slot="header">
      <router-link
        v-if="question.from"
        :to="question.from.username">{{ question.from.username }}</router-link>
      <span
        v-else
        class="text-muted">Anonymous</span>
      <time
        :title="moment.calendar()"
        class="text-muted">{{ moment.fromNow() }}</time>
    </div>
    <p class="card-text">{{ text }}</p>
    <hr>
    <b-button>Like {{ likeCount ? likeCount : '' }}</b-button>
    <a
      href="#"
      class="card-link pull-right">Comments ({{ commentCount }})</a>
  </b-card>
</template>

<script>
import moment from 'moment';


export default {
  name: 'Answer',
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
    question: {
      type: Object,
      required: true,
    },
    commentCount: {
      type: Number,
      required: true,
    },
    likeCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      moment: this.getMoment(),
      areCommentsActive: false,
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
  },
};
</script>

<style>
  .answer {
    margin-bottom: 20px;
  }
</style>

