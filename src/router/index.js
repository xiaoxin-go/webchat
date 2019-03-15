import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {path:'/',component:()=>document.body.clientWidth>500?import('../components/Home.vue'):import('../components/Wap.vue'),name:'Home'},
    {path:'/user',component:()=>import('../components/User.vue'),name:'User'},
    {path:'/friend',component:()=>import('../components/Friend.vue'),name:'Friend'},
    {path:'/group',component:()=>import('../components/Group.vue'),name:'Group'},
    {path:'/chat',component:()=>import('../components/Chat.vue'),name:'Chat'},
    {path:'/friend_info',component:()=>import('../components/FriendInfo.vue'),name:'FriendInfo'},
    {path:'/friend_add',component:()=>import('../components/FriendAdd.vue'),name:'FriendAdd'},
    {path:'/group_info/:id',component:()=>import('../components/GroupInfo.vue'),name:'GroupInfo'},
    {path:'/group_user_add/:id',component:()=>import('../components/GroupUserAdd.vue'),name:'GroupUserAdd'},
    {path:'/group_user_del/:id',component:()=>import('../components/GroupUserDel.vue'),name:'GroupUserDel'},
    {path:'/group_add',component:()=>import('../components/GroupAdd.vue'),name:'GroupAdd'},
    {path:'/login',component:()=>import('../components/Login.vue'),name:'Login'},
    {path:'/register',component:()=>import('../components/Register.vue'),name:'Register'},
  ]
})
