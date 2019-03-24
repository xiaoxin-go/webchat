<template>
    <div class="wap-main">
      <div class="wap-main-title">
        <div class="text">
          在线聊天室
          <Icon v-if="user.type < 2" type="md-arrow-dropdown" @click="chatroom_active=!chatroom_active" size="24"/>
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
          <li class="active" style="width: 23%;">
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
  import {getGroup, addChat, checkLogin} from '../../api/index.js'
  export default {
    name: "Group",
    mounted() {
      this.checkLogin();
      this.getGroup();
    },
    data() {
      return {
        user: {},
        chatroom_active: false,
        // 群组列表
        group_list: [],
      }
    },
    methods: {
      async checkLogin(){
        let resp = await checkLogin();
        if(resp.code === 200){
          this.user = resp.data;
        }
      },

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
        console.log(resp);
        if(resp.code === 200){
          this.group_list = resp.data;
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 进入聊天页面
      async changeChat(group) {
        group.chat_type = 2;
        let resp = await addChat(group);
        if(resp.code === 200){
          let chat_id = resp.data;
          this.$router.push(`/chat/${chat_id}`)
        }else{
          this.$Message.warning(resp.message)
        }
      },
    },
  }
</script>

<style>

</style>
