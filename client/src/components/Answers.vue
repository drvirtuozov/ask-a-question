<template>
  <div>
    <h3
      v-if="!hasProfileAnswers"
      class="text-muted text-center">
      {{ isMyProfile
        ? 'You haven\'t'
        : `${profile.username} hasn't`
      }} answered a single question yet
    </h3>

    <answer
      v-for="answer in profile.answers"
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
    profile() {
      return this.$store.getters.getProfile;
    },
    hasProfileAnswers() {
      return this.profile.answers && this.profile.answers.length;
    },
  },
};
</script>

