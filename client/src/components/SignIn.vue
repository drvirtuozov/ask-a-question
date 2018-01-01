<template>
  <b-nav-form
    v-if="navbar"
    @submit.prevent="login">
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

  <div
    v-else
    class="col-xl-3">
    <h2>Sign In</h2>
    <b-form @submit.prevent="login">
      <b-form-group label="Username:">
        <b-form-input
          type="text"
          v-model="form.username"
          required
          :class="form.usernameClassname"
          placeholder="Enter username..." />
        <div class="invalid-feedback">{{ form.errors.username }}</div>
      </b-form-group>
      <b-form-group label="Password:">
        <b-form-input
          type="password"
          v-model="form.password"
          required
          :class="form.passwordClassname"
          placeholder="Enter password..." />
        <div class="invalid-feedback">{{ form.errors.password }}</div>
      </b-form-group>
      <b-button
        type="submit"
        :disabled="form.isLoading">Log In</b-button>
    </b-form>
    <hr>
    <small>Don't have an account? <router-link to="/signup">Sign Up</router-link></small>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  props: {
    navbar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.getDefaultFormState(),
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
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
        errors: {
          username: '',
          password: '',
        },
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
          this.form.errors.password = e.description;
        } else {
          this.form.usernameClassname = 'is-invalid';
          this.form.errors.username = e.description;
        }
      }

      this.form.isLoading = false;
    },
  },
};
</script>

