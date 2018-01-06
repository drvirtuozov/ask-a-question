<template>
  <div class="col-xl-6">
    <b-card
      title="Vlad Barkalov"
      :sub-title="username | styleUname">
      <p class="card-text">i ball was rawt</p>
    </b-card>
    <ask v-if="!isMyProfile" />
    <answers :is-my-profile="isMyProfile" />
  </div>
</template>

<script>
import Ask from './Ask.vue';
import Answers from './Answers.vue';
import { GET_PROFILE, GET_ANSWERS } from '../store/types';


export default {
  name: 'Profile',
  components: { Ask, Answers },
  filters: {
    styleUname: value => `@${value}`,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    username() {
      return this.$route.params.username;
    },
    user() {
      return this.$store.getters.getUser;
    },
    profile() {
      return this.$store.getters.getProfile;
    },
    isMyProfile() {
      return this.username === this.user.username;
    },
  },
  async created() {
    await this.$store.dispatch(GET_PROFILE, this.username);
    this.$store.dispatch(GET_ANSWERS, this.profile.id);
  },
};
</script>

