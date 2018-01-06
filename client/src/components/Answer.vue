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
    <b-button
      @click="like"
      :variant="isLiked ? 'outline-primary' : 'outline-secondary'"
      :disabled="!isAuthenticated">Like {{ likesCount ? likesCount : '' }}</b-button>
    <a
      @click.prevent="openComments"
      href="#"
      class="card-link pull-right">Comments ({{ commentsCount }})</a>
    <div v-if="areCommentsOpen">
      <hr>
      <div v-if="comments.length">
        <comments :comments="comments"/>
        <br>
      </div>
      <form
        v-if="isAuthenticated"
        @submit.prevent="leaveComment">
        <b-form-group>
          <b-form-input
            type="text"
            v-model="comment"
            required
            placeholder="Leave a comment..." />
        </b-form-group>
        <b-button :disabled="!comment">Comment</b-button>
      </form>
      <h5
        v-else
        class="text-center text-muted">You need to be authenticated to leave a comment</h5>
    </div>
  </b-card>
</template>

<script>
import moment from 'moment';
import Comments from './Comments.vue';
import { GET_COMMENTS, CREATE_COMMENT } from '../store/types';


export default {
  name: 'Answer',
  components: { Comments },
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
      isLiked: false,
      areCommentsOpen: false,
      areCommentsLoading: true,
      comments: [],
      comment: '',
      likesCount: this.likeCount,
      commentsCount: this.commentCount,
    };
  },
  computed: {
    momentTick() {
      return this.$store.state.momentTick;
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
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
    like() {
      if (this.isLiked) {
        this.isLiked = false;
        this.likesCount -= 1;
      } else {
        this.isLiked = true;
        this.likesCount += 1;
      }
    },
    async openComments() {
      if (!this.comments.length && this.areCommentsLoading) {
        await this.getComments();
      }

      this.areCommentsOpen = !this.areCommentsOpen;
    },
    async getComments() {
      const comments = await this.$store.dispatch(GET_COMMENTS, this.id);
      this.comments = comments || [];
      this.areCommentsLoading = false;
    },
    async leaveComment() {
      const comment = await this.$store.dispatch(CREATE_COMMENT, {
        answerId: this.id,
        text: this.comment,
      });
      this.comments.push(comment);
      this.comment = '';
      this.commentsCount += 1;
    },
  },
};
</script>

<style>
  .answer {
    margin-bottom: 20px;
  }
</style>

