// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './base/index.css'
import User from './config'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client'

Vue.use(iView);
Vue.use(VueSocketio, socketio('http://127.0.0.1:5000'));

Vue.config.productionTip = false;
Vue.prototype.$User = User;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
