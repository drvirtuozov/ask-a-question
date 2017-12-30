<template>
  <div id="app">
    <navigation-bar />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';


export default {
  name: 'App',
  components: {
    NavigationBar,
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
};
</script>
