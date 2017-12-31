import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import jwtDecode from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import store from './store';


Vue.use(BootstrapVue);

const vue = new Vue({
  el: '#app',
  store,
  components: {
    App,
  },
  template: '<App />',
});

if (localStorage.getItem('token')) {
  store.commit('setUser', jwtDecode(localStorage.getItem('token')));
}

export default vue;
