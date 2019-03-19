import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {path:'/',component:()=>document.body.clientWidth>500?import('../components/Home.vue'):import('../components/Wap.vue'),name:'Home'},
    /*-------     用户管理      ------*/
    {path:'/user',component:()=>import('../components/User.vue'),name:'User'},
    {path:'/user_password',component:()=>import('../components/UserPassword.vue'),name:'UserPassword'},

    {path:'/chat',component:()=>import('../components/Chat.vue'),name:'Chat'},

    /*-------     好友管理      ------*/
    {path:'/friend',component:()=>import('../components/Friend.vue'),name:'Friend'},
    {path:'/friend_info',component:()=>import('../components/FriendInfo.vue'),name:'FriendInfo'},
    {path:'/friend_info/:id',component:()=>import('../components/FriendInfo.vue'),name:'FriendInfoID'},
    {path:'/friend_add',component:()=>import('../components/FriendAdd.vue'),name:'FriendAdd'},

    /*-------     群组管理      ------*/
    {path:'/group',component:()=>import('../components/Group.vue'),name:'Group'},
    {path:'/group_info/:id',component:()=>import('../components/GroupInfo.vue'),name:'GroupInfo'},
    {path:'/group_add',component:()=>import('../components/GroupAdd.vue'),name:'GroupAdd'},
    {path:'/group_user_add/:id',component:()=>import('../components/GroupUserAdd.vue'),name:'GroupUserAdd'},
    {path:'/group_user_del/:id',component:()=>import('../components/GroupUserDel.vue'),name:'GroupUserDel'},
    {path:'/group_user_del/:id',component:()=>import('../components/GroupUserDel.vue'),name:'GroupUserDel'},
    {path:'/group_admin/:id',component:()=>import('../components/GroupAdmin.vue'),name:'GroupAdmin'},
    {path:'/group_admin_add/:id',component:()=>import('../components/GroupAdminAdd.vue'),name:'GroupAdminAdd'},


    {path:'/login',component:()=>import('../components/Login.vue'),name:'Login'},
    {path:'/register',component:()=>import('../components/Register.vue'),name:'Register'},
  ]
})
