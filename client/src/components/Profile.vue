<template>
  <div class="col-xl-6">
    <b-card
      class="profile-header"
      :title="profile.first_name"
      :sub-title="profile.username | styleUname">
      <p class="card-text">i ball was rawt</p>
    </b-card>
    <div class="container">
      <ask v-if="!isMyProfile" />
      <answers :is-my-profile="isMyProfile" />
    </div>
  </div>
</template>

<script>
import Ask from './Ask.vue';
import Answers from './Answers.vue';
import { GET_ANSWERS, SET_ANSWERS, GET_PROFILE, SET_PROFILE } from '../store/types';
import store from '../store';


export default {
  name: 'Profile',
  components: { Ask, Answers },
  filters: {
    styleUname: value => `@${value}`,
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    profile() {
      return this.$store.getters.getProfile;
    },
    isMyProfile() {
      return this.profile.username === this.user.username;
    },
  },
  async beforeRouteEnter(to, from, next) {
    let profile;

    try {
      profile = await store.dispatch(GET_PROFILE, to.params.username);
    } catch (e) {
      next({ name: '404', params: { 0: to.params.username } });
      return;
    }

    const answers = await store.dispatch(GET_ANSWERS, profile.id);
    next((vm) => {
      vm.$store.commit(SET_PROFILE, profile);
      vm.$store.commit(SET_ANSWERS, answers);
    });
  },
  async beforeRouteUpdate(to, from, next) {
    const profile = await this.$store.dispatch(GET_PROFILE, to.params.username);
    const answers = await this.$store.dispatch(GET_ANSWERS, profile.id);
    this.$store.commit(SET_PROFILE, profile);
    this.$store.commit(SET_ANSWERS, answers);
    next();
  },
};
</script>

<style>
  .profile-header {
    margin-bottom: 20px;
  }
</style>

