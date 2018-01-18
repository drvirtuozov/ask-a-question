<template>
  <div>
    <h3
      v-if="!hasProfileAnswers"
      class="text-muted text-center">
      {{ isMyProfile
        ? 'You haven\'t'
        : `${username} hasn't`
      }} answered a single question yet
    </h3>

    <answer
      v-for="answer in answers"
      :key="answer.id"
      :id="answer.id"
      :text="answer.text"
      :timestamp="answer.timestamp"
      :question="answer.question"
      :comment-count="answer.comment_count"
      :like-count="answer.like_count" />
  </div>
</template>

<script>
import Answer from './Answer.vue';


export default {
  name: 'Answers',
  components: { Answer },
  props: {
    isMyProfile: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    username() {
      return this.$store.getters.getProfile.username;
    },
    answers() {
      return this.$store.getters.getAnswers;
    },
    hasProfileAnswers() {
      return this.answers && this.answers.length;
    },
  },
};
</script>

