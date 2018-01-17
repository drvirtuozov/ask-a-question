<template>
  <div
    id="main-container"
    class="container-fluid">
    <navigation-bar />
    <b-alert
      v-if="alert"
      @dismissed="alertDismissed"
      show
      dismissible
      class="container col-xl-6">
      {{ alert.text }}
    </b-alert>
    <router-view class="container" />
  </div>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue';
import { SET_ALERT } from './store/types';


export default {
  name: 'App',
  components: {
    NavigationBar,
  },
  computed: {
    alert() {
      return this.$store.state.alert;
    },
  },
  methods: {
    alertDismissed() {
      this.$store.commit(SET_ALERT);
    },
  },
};
</script>

<style>
  #main-container {
    margin-top: 70px;
  }
</style>

