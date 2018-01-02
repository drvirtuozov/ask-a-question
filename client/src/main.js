import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import jwtDecode from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';
import LogIn from './components/LogIn.vue';
import SignUp from './components/SignUp.vue';
import Questions from './components/Questions.vue';
import store from './store';


Vue.use(VueRouter);
Vue.use(BootstrapVue);

if (localStorage.getItem('token')) {
  store.commit('setUser', jwtDecode(localStorage.getItem('token')));
}

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
      {
        path: '/',
        redirect() {
          if (store.state.isAuthenticated) {
            return '/questions';
          }

          return '/signup';
        },
      },
      {
        path: '/login',
        component: LogIn,
        beforeEnter(to, from, next) {
          if (store.state.isAuthenticated) {
            next('/');
          }

          return next();
        },
      },
      {
        path: '/signup',
        component: SignUp,
        beforeEnter(to, from, next) {
          if (store.state.isAuthenticated) {
            next('/');
          }

          return next();
        },
      },
      {
        path: '/questions',
        component: Questions,
        beforeEnter(to, from, next) {
          if (!store.state.isAuthenticated) {
            next('/');
          }

          return next();
        },
      },
    ],
  }),
});

export default vue;
