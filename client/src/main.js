import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App.vue';


Vue.use(BootstrapVue);

const vue = new Vue({
  el: '#app',
  render: h => h(App),
});

export default vue;
