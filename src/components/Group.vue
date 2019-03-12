<template>
    <div class="wap-main">
      <div class="wap-main-title">
        <div class="text">
          在线聊天室
          <Icon v-if="$User.user.type < 2" type="md-arrow-dropdown" @click="chatroom_active=!chatroom_active" size="24"/>
          <div class="wap-create-group-modal" v-show="chatroom_active">
            <ul>
              <li @click="$router.push('/group_add')">创建群组</li>
              <li @click="$router.push('/friend_add')">添加好友</li>
            </ul>
          </div>
        </div>
        <!--<div class="more">-->
          <!--<Icon type="md-more" size="30"/>-->
        <!--</div>-->
      </div>
      <div class="wap-main-body" @click="chatroom_active=false">
        <!-----------------------   群聊界面  ----------------------->
        <div class="wap-main-body-friend">
          <div class="wap-main-body-friend-search">
            <Input search placeholder="搜索" size="large"/>
          </div>

          <!-- 群组 -->
          <div class="wap-main-body-friend-body">
            <template v-for="group in group_list">
              <div class="chat-item" @click="changeChat(group)">
                <div class="chat-img">
                  <img :src="group.logo">
                </div>
                <div class="chat-text">
                  {{ group.name }}
                </div>
              </div>
            </template>
          </div>
        </div>

      </div>
      <div class="wap-main-bottom">
        <ul>
          <li class="wap-main-bottom-chat" @click="toChat">
            <div>
              <Icon type="ios-chatbubbles" size="32"/>
            </div>
            <p>聊天</p>
          </li>
          <li @click="toFriend" style="width: 23%;">
            <div>
              <Icon type="md-contacts" size="32"/>
            </div>
            <p>
              好友
            </p>
          </li>
          <li @click="toGroup" class="active" style="width: 23%;">
            <div>
              <Icon type="ios-people" size="34"/>
            </div>
            <p>
              群聊
            </p>
          </li>
          <li class="wap-main-bottom-my" @click="toUser">
            <div>
              <Icon type="md-person" size="32"/>
            </div>
            <p>我</p>
          </li>
        </ul>
      </div>
    </div>

</template>

<script>
  import {addFriend, addGroup, addGroupUser, getChat, getChatMessage, getFriend,
    getGroup, getGroupUser, getUser, getUserInfo, deleteChat, deleteGroup,
    deleteGroupUser, deleteUser ,delFriend, updateFriend, updateGroup,
    updateGroupUser, updateUser, uploadLogo, Logout, addChat} from '../api/index.js'
  export default {
    name: "Wap",
    mounted() {
      if(!this.$User.user){
        this.$router.push('/login')
      }else{
        //this.getGroup()
      }
    },
    data() {
      return {
        chatroom_active: false,
        // 群组列表
        group_list: [
          {'id': 1, 'name': 'test', 'logo': '/static/images/test.jpg', 'type': 'group'},
          {'id': 2, 'name': 'test1', 'logo': '/static/images/mv1.jpg', 'type': 'group'},
          {'id': 3, 'name': 'test2', 'logo': '/static/images/mv2.png', 'type': 'group'},
          {'name': 'test3', 'logo': '/static/images/mv3.jpg', 'type': 'group'},
          {'name': 'test4', 'logo': '/static/images/mv4.jpg', 'type': 'group'},
          {'name': 'test5', 'logo': '/static/images/mv5.jpeg', 'type': 'group'},
          {'name': 'test6', 'logo': '/static/images/mv2.png', 'type': 'group'},
          {'name': 'test7', 'logo': '/static/images/mv1.jpg', 'type': 'group'},
        ],
      }
    },
    methods: {
      // 跳转到聊天页面
      toChat() {
        this.$router.push('/')
      },

      // 跳转到好友页面
      toFriend() {
        this.$router.push('/friend')
      },

      // 跳转到用户页面
      toUser(){
        this.$router.push('/user')
      },

      // 获取群组列表
      async getGroup(){
        let resp = await getGroup();
        if(resp.code === 200){
          this.group_list = resp.data;
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 进入聊天页面
      changeChat(group) {
        this.$router.push({
          name: 'Chat',
          params:{
            chat: group
          }
        })
      },



    },
    sockets:{
      connect: function(){
        console.log('socket connected')
      },
      message: function(){
        console.log('返回' + val)
      }
    },
    filters: {
    },
    watch:{
      // message_data(){
      //   this.$nextTick(() => {
      //     console.log('....');
      //     var container = this.$el.querySelector("chat-body");
      //     container.scrollTop = container.scrollHeight;
      // })
      // }
    }
  }
</script>

<style>

</style>
