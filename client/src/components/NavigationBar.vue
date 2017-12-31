<template>
  <b-navbar
    toggleable="md"
    type="dark"
    variant="info">
    <b-navbar-toggle target="nav_collapse" />
    <b-navbar-brand href="#">Ask a Question</b-navbar-brand>
    <b-collapse
      is-nav
      id="nav_collapse">
      <b-navbar-nav
        class="ml-auto"
        v-if="isAuthenticated">
        <h3 v-if="questionsCount"><b-badge variant="light">{{ questionsCount }}</b-badge></h3>
        <b-nav-item-dropdown right>
          <template slot="button-content">{{ username }}</template>
          <b-dropdown-item>Profile</b-dropdown-item>
          <b-dropdown-item @click="logout">Log Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav
        class="ml-auto"
        v-else>
        <b-nav-form @submit.prevent="login">
          <b-form-input
            size="sm"
            class="mr-sm-2"
            :class="form.usernameClassname"
            type="text"
            placeholder="Username"
            required
            v-model="form.username" />
          <b-form-input
            size="sm"
            class="mr-sm-2"
            :class="form.passwordClassname"
            type="password"
            placeholder="Password"
            required
            v-model="form.password" />
          <b-button
            size="sm"
            class="my-2 my-sm-0"
            type="submit"
            :disabled="form.isLoading">Log In</b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'NavigationBar',
  data() {
    return {
      form: this.getDefaultFormState(),
    };
  },
  computed: {
    username() {
      return this.$store.state.user.username;
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    questionsCount() {
      return this.$store.getters.getQuestionsCount;
    },
  },
  watch: {
    isAuthenticated() {
      this.form = this.getDefaultFormState();
    },
  },
  methods: {
    getDefaultFormState() {
      return {
        username: '',
        password: '',
        usernameClassname: '',
        passwordClassname: '',
        isLoading: false,
      };
    },
    async login() {
      this.form.isLoading = true;

      try {
        await this.$store.dispatch('login', {
          username: this.form.username,
          password: this.form.password,
        });
      } catch (e) {
        if (e.description.includes('password')) {
          this.form.passwordClassname = 'is-invalid';
          this.form.usernameClassname = 'is-valid';
        } else {
          this.form.usernameClassname = 'is-invalid';
        }
      }

      this.form.isLoading = false;
    },
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>
