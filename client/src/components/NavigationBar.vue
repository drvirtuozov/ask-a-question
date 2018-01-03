<template>
  <b-navbar
    toggleable="md"
    type="dark"
    variant="info">
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
        <router-link to="/questions">
          <h3 v-if="questionCount"><b-badge variant="light">{{ questionCount }}</b-badge></h3>
        </router-link>
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
  </b-navbar>
</template>

<script>
import { LOGOUT } from '../store/types';
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
      this.$store.dispatch(LOGOUT);
    },
    goToProfile() {
      this.$router.push(`/${this.username}`);
    },
  },
};
</script>
