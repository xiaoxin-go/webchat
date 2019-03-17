<template>
  <div>
    <input type="file" id="send-image" style="display: none;" @change="uploadImage">
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

        <!------------------  个人设置页面  ---------------->
        <div class="wap-main-body-setting">
          <div class="wap-main-friend-body">
            <div class="wap-main-friend-logo">
              <img :src="user.logo" alt="">
            </div>
            <div class="wap-main-friend-info">
              <p class="wap-main-friend-remark">{{user.username}}</p>
              <p class="wap-main-friend-nickname">昵称：{{user.nickname}} <Icon type="md-create" alt="修改昵称" @click="update_nickname_modal=true"/></p>
              <Button style="margin-top: 10px;" @click="clickImage" size="small">更换头像</Button>
            </div>
          </div>
          <div class="wap-main-friend-bottom">
            <div class="wap-main-friend-update-remark" @click="$router.push('/user_password')">修改密码</div>
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

    <!--  修改群名模态框 -->
    <Modal
      v-model="update_nickname_modal"
      @on-cancel="update_nickname_modal=false"
      title="修改群聊名称"
      class-name="wap-my-modal">
      <div class="wap-my-modal-text">
        <Input placeholder="请输入新昵称" autofocus v-model="new_nickname"/>
      </div>
      <div slot="footer">
        <Button type="text" @click="update_nickname_modal=false">取消</Button>
        <Button type="primary" @click="updateUserNickname">确定</Button>
      </div>
    </Modal>

  </div>

</template>

<script>
  import {updateUser, uploadLogo, Logout} from '../api/index.js'
  export default {
    name: "Wap",
    mounted() {
      if(!this.$User.user){
        this.$router.push('/login')
      }else{
        //this.getInfo();
        this.user = this.$User.user;
      }
    },
    data() {
      return {
        chatroom_active: false,
        update_nickname_modal: false,
        new_nickname: '',
        user: {}
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

      // 选择图片
      clickImage(){
        document.getElementById('send-image').click();
      },

      // 发送图片
      async uploadImage(){
        let input = document.getElementById('send-image');
        let file = input.files[0];
        let formData = new FormData();
        formData.append('file', file);
        let resp = await uploadLogo(formData);
        console.log(resp);
        if (resp.code === 200){

          this.user.logo = this.$Server + resp.data.url;        // 返回的是头像路径
          console.log('上传头像成功', this.user.logo);
          this.updateUserLogo();
        }else{
          this.$Message.error(resp.message)
        }
      },

      // 修改头像
      async updateUserLogo(){
        let json_data = {
          logo: this.user.logo
        };
        let resp = await updateUser(json_data);
        if(resp.code === 200){
          console.log('更换头像成功', this.user);
          this.$User.setUser(this.user);
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 修改昵称
      async updateUserNickname(){
        if(!this.new_nickname.trim()){this.$Message.warning('用户昵称不能为空'); return}
        let json_data = {
          nickname: this.new_nickname
        };
        let resp = await updateUser(json_data);
        if(resp.code === 200){
          this.user.nickname = this.new_nickname;
          this.$User.setUser(this.user);
          this.update_nickname_modal = false;
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 退出登录
      async Logout(){
        let resp = await Logout();
        console.log(resp);
        if(resp.code === 200){
          this.$Message.success('用户退出登录成功');
          this.$User.setUser(null);
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
