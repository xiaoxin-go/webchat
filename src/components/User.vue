<template>
  <div>
    <input type="file" id="send-image" style="display: none;" @change="uploadImage">
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

        <!------------------  个人设置页面  ---------------->
        <div class="wap-main-body-setting">
          <div class="wap-main-friend-body">
            <div class="wap-main-friend-logo">
              <img :src="$User.user.logo" alt="">
            </div>
            <div class="wap-main-friend-info">
              <p class="wap-main-friend-remark">{{$User.user.username}}</p>
              <p class="wap-main-friend-nickname">昵称：{{$User.user.nickname}}</p>
            </div>
          </div>
          <div class="wap-main-friend-bottom">
            <div class="wap-main-friend-update-remark" @click="">账户安全</div>
            <div class="wap-main-friend-sendmessage" @click="">清空站点聊天记录</div>
            <div class="wap-main-friend-delete"><Button long type="error" @click="Logout">退出站点</Button></div>
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
          <li @click="toGroup" style="width: 23%;">
            <div>
              <Icon type="ios-people" size="34"/>
            </div>
            <p>
              群聊
            </p>
          </li>
          <li class="wap-main-bottom-my active">
            <div>
              <Icon type="md-person" size="32"/>
            </div>
            <p>我</p>
          </li>
        </ul>
      </div>
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
        //this.getInfo();
      }
    },
    data() {
      return {
        chatroom_active: false,
      }
    },
    methods: {
      // 跳转到消息页面
      toChat() {
        this.$router.push('/');
      },
      // 跳转到好友页面
      toFriend() {
        this.$router.push('/friend')
      },

      // 跳转到群组页面
      toGroup() {
        this.$router.push('/group')
      },



      // 退出登录
      async Logout(){
        let resp = await Logout();
        console.log(resp);
        if(resp.code === 200){
          this.$Message.success('用户退出登录成功');
          this.$User.setName(null);
          this.$router.push('/login')
        }else{
          this.$Message.warning('用户退出登录异常');
        }
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
