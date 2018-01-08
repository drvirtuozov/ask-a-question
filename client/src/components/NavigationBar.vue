<template>
  <b-navbar
    toggleable="md"
    type="light"
    variant="light"
    fixed="top">
    <b-navbar-toggle target="nav_collapse" />
    <router-link to="/">
      <b-navbar-brand>Ask a Question</b-navbar-brand>
    </router-link>
    <b-collapse
      is-nav
      id="nav_collapse">
      <b-navbar-nav
        class="ml-auto"
        v-if="isAuthenticated">
        <b-nav-item-dropdown right>
          <template slot="button-content">{{ username }}</template>
          <b-dropdown-item @click="goToProfile">Profile</b-dropdown-item>
          <b-dropdown-item @click="logout">Log Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <b-navbar-nav
        class="ml-auto"
        v-else>
        <log-in navbar />
      </b-navbar-nav>
    </b-collapse>
    <router-link
      to="/questions"
      v-if="questionCount">
      <b-badge>{{ questionCount }}</b-badge>
    </router-link>
  </b-navbar>
</template>

<script>
import { REMOVE_UNSET_TOKEN } from '../store/types';
import LogIn from './LogIn.vue';


export default {
  name: 'NavigationBar',
  components: { LogIn },
  computed: {
    username() {
      return this.$store.getters.getUser.username;
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    questionCount() {
      return this.$store.getters.getQuestionCount;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch(REMOVE_UNSET_TOKEN);
    },
    goToProfile() {
      this.$router.push(`/${this.username}`);
    },
  },
};
</script>
