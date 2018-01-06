<template>
  <div>
    <navigation-bar />
    <router-view
      id="main-container"
      class="container" />
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
  #main-container {
    margin-top: 70px;
  }
</style>

