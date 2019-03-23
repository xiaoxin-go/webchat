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
        <!-----------------------   好友界面  --------------------->
        <div class="wap-main-body-friend">
          <div class="wap-main-body-friend-search">
            <Input search v-model="search_name" placeholder="搜索"  size="large"/>
          </div>

          <!-- 好友 -->
          <div class="wap-main-body-friend-body">
            <template v-for="(friend, index) in friend_list" v-if="(friend.remark_name && friend.remark_name.startsWith(search_name)) || (friend.nickname && friend.nickname.startsWith(search_name))">
              <div class="chat-item" @click="clickFriend(friend.id)">
                <div class="chat-img">
                  <img :src="friend.logo">
                </div>
                <div class="chat-text">
                  {{ friend.remark_name || friend.nickname }}
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
          <li class="active" style="width: 23%;">
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
  import {checkLogin, getFriend,} from '../api/index.js'
  export default {
    name: "Friend",
    mounted() {
      this.checkLogin();
      this.getFriend();
    },
    data() {
      return {
        user: {},
        chatroom_active: false,
        search_name: '',
        /* ------     好友相关属性    ------- */
        // 好友列表
        friend_list: [
        ],
      }
    },
    methods: {
      async checkLogin(){
        let resp = await checkLogin();
        if(resp.code === 200){
          this.user = resp.data;
        }
      },

      // 跳转到消息页面
      toChat() {
        this.$router.push('/');
      },

      // 跳转到群组页面
      toGroup() {
        this.$router.push('/group')
      },

      // 跳转到个人设置
      toUser() {
        this.$router.push('/user')
      },

      // 点击某个好友
      clickFriend(friend_id){
        this.$router.push(`/friend_info/${friend_id}`)
      },

      /*----------------     好友相关方法    ---------------*/
      // 获取好友列表
      async getFriend(){
        let resp = await getFriend();
        if(resp.code === 200){
          this.friend_list = resp.data;
        }else{
          this.$Message.error(resp.message)
        }
      },
    },
  }
</script>

<style>

</style>
