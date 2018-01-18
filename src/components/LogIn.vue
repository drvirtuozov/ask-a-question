<template>
  <b-nav-form
    v-if="navbar"
    @submit.prevent="login">
    <b-form-input
      size="sm"
      class="mr-sm-2"
      type="text"
      placeholder="Username"
      required
      v-model="username"
      :state="usernameState" />
    <b-form-input
      size="sm"
      class="mr-sm-2"
      type="password"
      placeholder="Password"
      required
      v-model="password"
      :state="passwordState" />
    <b-button
      size="sm"
      class="my-2 my-sm-0"
      type="submit"
      :disabled="isLoading">Log In</b-button>
  </b-nav-form>

  <div
    v-else
    class="col-xl-3">
    <h2>Sign In</h2>
    <hr>
    <b-form @submit.prevent="login">
      <b-form-group
        label="Username:"
        :invalid-feedback="usernameInvalidFeedback"
        :state="usernameState">
        <b-form-input
          type="text"
          v-model="username"
          required
          placeholder="Type username..."
          :state="usernameState" />
      </b-form-group>
      <b-form-group
        label="Password:"
        :invalid-feedback="passwordInvalidFeedback"
        :state="passwordState">
        <b-form-input
          type="password"
          v-model="password"
          required
          placeholder="Type password..."
          :state="passwordState" />
      </b-form-group>
      <b-button
        type="submit"
        :disabled="isLoading">Log In</b-button>
    </b-form>
    <hr>
    <p class="text-center">
      <small>Don't have an account?
        <router-link to="/signup">Sign Up</router-link>
      </small>
    </p>
  </div>
</template>

<script>
import { CREATE_SET_TOKEN } from '../store/types';

export default {
  name: 'LogIn',
  props: {
    navbar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      username: '',
      password: '',
      usernameState: null,
      usernameInvalidFeedback: '',
      passwordState: null,
      passwordInvalidFeedback: '',
      isLoading: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  watch: {
    isAuthenticated() {
      this.$router.push('/');
    },
  },
  methods: {
    async login() {
      this.isLoading = true;

      try {
        await this.$store.dispatch(CREATE_SET_TOKEN, {
          username: this.username,
          password: this.password,
        });
      } catch (e) {
        if (e.description.includes('password')) {
          this.passwordState = false;
          this.usernameState = true;
          this.passwordInvalidFeedback = e.description;
        } else {
          this.usernameState = false;
          this.usernameInvalidFeedback = e.description;
        }
      }

      this.isLoading = false;
    },
  },
};
</script>

