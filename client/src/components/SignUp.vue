<template>
  <div class="col-xl-4">
    <h2>Don't have an account?</h2>
    <h4>Let's create one!</h4>
    <hr>
    <b-form
      @submit.prevent="signup"
      class="container col-xl-9">
      <b-form-group
        label="First Name:"
        description="Let us know your real name (required)"
        :valid-feedback="firstNameValidFeedback"
        :invalid-feedback="firstNameInvalidFeedback"
        :state="firstNameState">
        <b-input-group left="<i class='fa fa-male' aria-hidden='true' />">
          <b-input
            type="text"
            v-model="firstName"
            required
            placeholder="Type first name here..."
            :state="firstNameState" />
        </b-input-group>
      </b-form-group>
      <b-form-group
        label="Username:"
        description="Login for your account (required)"
        :valid-feedback="usernameValidFeedback"
        :invalid-feedback="usernameInvalidFeedback"
        :state="usernameState">
        <b-input-group left="<i class='fa fa-user' aria-hidden='true' />">
          <b-input
            type="text"
            @input="checkUsername"
            v-model="username"
            required
            placeholder="Type username here..."
            :state="usernameState" />
        </b-input-group>
      </b-form-group>
      <b-form-group
        label="Email:"
        description="You can type fake mail now (required)"
        :valid-feedback="emailValidFeedback"
        :invalid-feedback="emailInvalidFeedback"
        :state="emailState">
        <b-input-group left="<i class='fa fa-at' aria-hidden='true' />">
          <b-input
            type="email"
            v-model="email"
            required
            placeholder="Type your email here..."
            :state="emailState" />
        </b-input-group>
      </b-form-group>
      <b-form-group
        label="Password:"
        description="Password for your account (required)"
        :valid-feedback="passwordValidFeedback"
        :invalid-feedback="passwordInvalidFeedback"
        :state="passwordState">
        <b-input-group left="<i class='fa fa-lock' aria-hidden='true' />">
          <b-input
            type="password"
            v-model="password"
            required
            placeholder="Type your password here..."
            :state="passwordState" />
        </b-input-group>
      </b-form-group>
      <b-button
        type="submit"
        variant="primary"
        size="lg"
        :disabled="isLoading">Sign Up</b-button>
    </b-form>
    <hr>
    <p class="text-center">
      <small>Already have an account?
        <router-link to="/login">Log In</router-link>
      </small>
    </p>
  </div>
</template>

<script>
import { CREATE_SET_USER, GET_PROFILE } from '../store/types';


export default {
  name: 'SignUp',
  data() {
    return {
      firstName: '',
      firstNameState: null,
      firstNameValidFeedback: '',
      firstNameInvalidFeedback: '',
      username: '',
      usernameState: null,
      usernameValidFeedback: '',
      usernameInvalidFeedback: '',
      email: '',
      emailState: null,
      emailValidFeedback: '',
      emailInvalidFeedback: '',
      password: '',
      passwordState: null,
      passwordValidFeedback: '',
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
    checkUsername() {
      clearTimeout(this.timeout);
      this.usernameState = null;
      this.timeout = setTimeout(async () => {
        try {
          await this.$store.dispatch(GET_PROFILE, this.username);
          this.usernameState = false;
          this.usernameInvalidFeedback = 'Username already taken';
        } catch (e) {
          this.usernameState = true;
          this.usernameValidFeedback = 'Username available';
        }
      }, 1000);
    },
    async signup() {
      this.isLoading = true;

      try {
        await this.$store.dispatch(CREATE_SET_USER, {
          firstName: this.firstName,
          username: this.username,
          email: this.email,
          password: this.password,
        });
      } catch (e) {
        if (e.description.includes('first_name')) {
          this.firstNameState = false;
          this.firstNameInvalidFeedback = e.description;
        } else if (e.description.includes('username')) {
          this.usernameState = false;
          this.usernameInvalidFeedback = e.description;
        } if (e.description.includes('email')) {
          this.emailState = false;
          this.emailInvalidFeedback = e.description;
        } else if (e.description.includes('password')) {
          this.passwordState = false;
          this.passwordInvalidFeedback = e.description;
        }
      }

      this.isLoading = false;
    },
  },
};
</script>
