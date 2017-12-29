<template>
  <div id="app">
    <navigation-bar></navigation-bar>
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'


export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    NavigationBar
  }
}
</script>
