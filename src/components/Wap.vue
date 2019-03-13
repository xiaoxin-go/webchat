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
      <div class="wap-main-body" @click="chatroom_active=false">

        <!---------------------------  聊天界面  -------------------------->
        <div class="wap-main-body-message">
          <template v-for="chat in chat_list">
            <div class="chat-item" @click="changeChat(chat.id)">
              <div class="chat-img">
                <img :src="chat.logo">
              </div>
              <div class="chat-text">
                <div class="chat-text-top">
                  <span class="chat-text-name">{{chat.name}}</span>
                  <span class="chat-text-time">{{chat.update_time}}</span>
                </div>
                <div class="chat-text-message">
                  {{chat.message}}
                </div>
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
  import {getChat, getUserInfo,} from '../api/index.js'

  export default {
    name: "Wap",
    mounted() {
      if (!this.$User.user) {
        this.$router.push('/login')
      } else {
        //this.getChat();
      }
    },
    data() {
      return {
        chatroom_active: false,  // 点击最主面聊天室

        // 聊天列表
        chat_list: [
          {'id': 1, 'name': 'test', 'logo': '/static/images/admin.jpg', 'type': 'group', 'chat_id': 1},
          {'id': 2, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'type': 'friend', 'chat_id': 2},
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

      // 进入聊天页面
      changeChat(chat_id) {
        this.$router.push({path: '/chat/', query:{id: chat_id}})
      },

    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      message: function () {
        console.log('返回' + val)
      }
    },
    filters: {},
    watch: {
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
