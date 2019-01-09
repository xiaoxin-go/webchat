import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {path:'/',component:()=>import('../components/Home.vue'),name:'Home'},
    {path:'/login',component:()=>import('../components/Login.vue'),name:'Login'},
    {path:'/register',component:()=>import('../components/Register.vue'),name:'Register'},
  ]
})
