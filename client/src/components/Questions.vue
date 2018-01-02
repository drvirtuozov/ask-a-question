<template>
  <div><h1>Questions</h1></div>
</template>

<script>
export default {
  name: 'Questions',
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

