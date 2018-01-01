import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import jwtDecode from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';
import store from './store';


Vue.use(VueRouter);
Vue.use(BootstrapVue);

const vue = new Vue({
  el: '#app',
  store,
  components: {
    App,
  },
  template: '<App />',
  router: new VueRouter({
    mode: 'history',
    routes: [
      { path: '/signin', component: SignIn },
      { path: '/signup', component: SignUp },
    ],
  }),
});

if (localStorage.getItem('token')) {
  store.commit('setUser', jwtDecode(localStorage.getItem('token')));
}

export default vue;
