import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {path:'/', redirect: document.body.clientWidth>500?'/home':'/wap'},
    {path:'/pc/chat',component:()=>import('../components/pc/Chat.vue'),name:'pcChat'},
    {path:'/pc/group',component:()=>import('../components/pc/Group.vue'),name:'pcGroup'},
    {path:'/pc/friend',component:()=>import('../components/pc/Friend.vue'),name:'pcFriend'},
    {path:'/home',component:()=>import('../components/pc/Home.vue'),name:'Home'},
    {path:'/wap',component:()=>import('../components/wap/Wap.vue'),name:'Wap'},
    /*-------     用户管理      ------*/
    {path:'/user',component:()=>import('../components/wap/User.vue'),name:'User'},
    {path:'/user_password',component:()=>import('../components/wap/UserPassword.vue'),name:'UserPassword'},

    {path:'/chat/:id',component:()=>import('../components/wap/Chat.vue'),name:'Chat'},

    /*-------     好友管理      ------*/
    {path:'/friend',component:()=>import('../components/wap/Friend.vue'),name:'Friend'},
    {path:'/friend_info/:id',component:()=>import('../components/wap/FriendInfo.vue'),name:'FriendInfo'},
    {path:'/friend_add',component:()=>import('../components/wap/FriendAdd.vue'),name:'FriendAdd'},

    /*-------     群组管理      ------*/
    {path:'/group',component:()=>import('../components/wap/Group.vue'),name:'Group'},
    {path:'/group_info/:id',component:()=>import('../components/wap/GroupInfo.vue'),name:'GroupInfo'},
    {path:'/group_add',component:()=>import('../components/wap/GroupAdd.vue'),name:'GroupAdd'},
    {path:'/group_user_add/:id',component:()=>import('../components/wap/GroupUserAdd.vue'),name:'GroupUserAdd'},
    {path:'/group_user_del/:id',component:()=>import('../components/wap/GroupUserDel.vue'),name:'GroupUserDel'},
    {path:'/group_user_del/:id',component:()=>import('../components/wap/GroupUserDel.vue'),name:'GroupUserDel'},
    {path:'/group_admin/:id',component:()=>import('../components/wap/GroupAdmin.vue'),name:'GroupAdmin'},
    {path:'/group_admin_add/:id',component:()=>import('../components/wap/GroupAdminAdd.vue'),name:'GroupAdminAdd'},


    // {path:'/login',component:()=>import('../components/Login.vue'),name:'Login'},
    // {path:'/register',component:()=>import('../components/Register.vue'),name:'Register'},
  ]
})
