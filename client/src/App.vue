<template>
  <div>
    <navigation-bar />
    <router-view class="container" />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';


export default {
  name: 'App',
  components: {
    NavigationBar,
  },
};
</script>

<style>
  .container {
    margin-top: 20px;
  }
</style>

