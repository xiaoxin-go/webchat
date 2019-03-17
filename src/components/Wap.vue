<template>
    <div class="wap-main">
      <div class="wap-main-title">
        <div class="text">
          在线聊天室
          <Icon v-if="$User.user.type < 2" type="md-arrow-dropdown" @click="chatroom_active=!chatroom_active"
                size="24"/>
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
      <div class="wap-main-body" @click="chatroom_active=chat_delete_modal=false">

        <!---------------------------  聊天界面  -------------------------->
        <div class="wap-main-body-message">
          <template v-for="chat in chat_list">
            <div class="chat-item" @click="changeChat(chat.id)" @touchstart="touchStart(chat.id)" @touchend="touchEnd">
              <div class="chat-img">
                <img :src="chat.logo">
              </div>
              <div class="chat-text">
                <div class="chat-text-top">
                  <span class="chat-text-name">{{chat.name}}</span>
                  <span class="chat-text-time">{{chat.update_time}}</span>
                </div>
                <div class="chat-text-message" v-html="chat.message">
                </div>
              </div>
              <div class="chat-item-modal" v-if="chat_delete_modal === chat.id">
                <p @click="delChat(chat)">删除该聊天</p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="wap-main-bottom">
        <ul>
          <li class="wap-main-bottom-chat active">
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
          <li @click="toGroup" style="width: 23%;">
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
  import {getChat, deleteChat} from '../api/index.js'

  export default {
    name: "Wap",
    mounted() {
      if (!this.$User.user) {
        this.$router.push('/login')
      } else {
        this.getChat();
        this.in_chat_list();
      }
    },
    data() {
      return {
        chatroom_active: false,  // 点击最主面聊天室
        chat_delete_modal: '',
        Loop: null,

        // 聊天列表
        chat_list: [
          {'id': 1, 'name': 'test', 'logo': '/static/images/admin.jpg', 'type': 'group', 'chat_obj_id': 1},
          {'id': 2, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'type': 'friend', 'chat_obj_id': 2},
        ],

      }
    },
    methods: {
      // 跳转到好友页面
      toFriend() {
        this.$router.push('/friend')
      },

      // 跳转到群组页面
      toGroup() {
        this.$router.push('/group')
      },

      // 跳转到个人设置
      toUser() {
        this.$router.push('/user')
      },

      // 获取聊天消息
      async getChat() {
        let resp = await getChat();
        if (resp.code === 200) {
          this.chat_list = resp.data;
        } else {
          this.$Message.error(resp.message)
        }
      },

      touchStart(chat_id){
        var self = this;
        this.Loop=setTimeout(function(){
          console.log('start.........', chat_id);
          self.chat_delete_modal = chat_id;
        },500);
      },
      touchEnd(){
        clearTimeout(this.Loop);
      },

      // 删除聊天
      async delChat(chat){
        let json_data = {
          chat_id: chat.id
        };
        let resp = await deleteChat(json_data);
        if(resp.code === 200){
          this.getChat();
        }
      },

      // 进入聊天页面
      changeChat(chat_id) {
        this.$router.push({path: '/chat/', query:{id: chat_id}})
      },
      in_chat_list(){
        this.$socket.emit('in_chat_list')
      },
      out_chat_list(){
        this.$socket.emit('out_chat_list')
      }

    },
    destroyed() {
      this.out_chat_list()
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      message: function (chat) {
        console.log(chat);
        let chat_item = this.chat_list.filter(item=>item.id === chat.id)[0];
        this.chat_list.pop(chat_item);
        this.chat_list.unshift(chat);
      }
    },
    filters: {},
  }
</script>

<style>

</style>
