<template>
  <div>
    <h3>Sign Up</h3>
    <router-link to="/login">log in</router-link>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
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
};
</script>
