import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {path:'/',component:()=>document.body.clientWidth>500?import('../components/Home.vue'):import('../components/Wap.vue'),name:'Home'},
    {path:'/login',component:()=>import('../components/Login.vue'),name:'Login'},
    {path:'/register',component:()=>import('../components/Register.vue'),name:'Register'},
  ]
})
