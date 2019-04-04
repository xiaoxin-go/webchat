<template>
  <div id="left">
    <div class="user" @mouseleave="user_info=false">
      <img :src="user.logo" alt="" @click="clickImage" @mouseover="user_info=true">
      <div class="user-text">
        {{user.nickname}}
      </div>
      <div class="user-info" v-if="user_info" @mouseleave="user_info=false">
        <ul>
          <li @click="change_nickname_modal=true">更改昵称</li>
          <li @click="change_password_modal=true">更改密码</li>
          <li @click="Logout">退出登录</li>
        </ul>
      </div>
    </div>

    <input type="file" id="send-image" style="display: none;" @change="uploadImage">

    <!--  菜单按钮  -->
    <ul>
      <li :class="'menu-item '+(active==='chat'?'active':'')" @click="toMenu('chat')">
        <Tooltip content="消息" placement="right-start">
          <div :style="'width: ' + (active==='message'?'76px':'80px')">
            <Icon type="ios-chatbubbles" size="30"/>
          </div>
        </Tooltip>
      </li>
      <li :class="'menu-item '+(active==='group'?'active':'')" @click="toMenu('group')">
        <Tooltip content="群聊" placement="right-start">
          <div :style="'width: ' + (active==='chat'?'76px':'80px')">
            <Icon type="md-contacts" size="30"/>
          </div>
        </Tooltip>
      </li>
      <li :class="'menu-item '+(active==='friend'?'active':'')" @click="toMenu('friend')">
        <Tooltip content="好友" placement="right-start">
          <div :style="'width: ' + (active==='friend'?'76px':'80px')">
            <Icon type="md-person" size="30"/>
          </div>
        </Tooltip>
      </li>
    </ul>

    <!--  修改用户昵称模态框  -->
    <Modal
      v-model="change_nickname_modal"
      @on-cancel="change_nickname_modal=false"
      title="修改昵称"
      class-name="my-modal" width="400px">
      <div class="my-modal-input">
        <input type="text" placeholder="请输入新昵称" v-model="new_nickname">
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="change_nickname_modal=false">取消</Button>
        <Button type="primary" size="large" @click="updateUserNickname">确定</Button>
      </div>
    </Modal>

    <!--  修改用户密码模态框 -->
    <Modal
      v-model="change_password_modal"
      @on-cancel="change_password_modal=false"
      title="修改密码"
      class-name="my-modal" width="400px">
      <!--<div class="my-modal-input">-->
        <!--<input type="text" placeholder="请输入旧密码" v-model="old_password">-->
      <!--</div>-->
      <div class="my-modal-input">
        <input type="text" placeholder="请输入新密码" v-model="new_password">
      </div>
      <div class="my-modal-input">
        <input type="text" placeholder="重复输入新密码" v-model="new_password_re">
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="change_password_modal=false">取消</Button>
        <Button type="primary" size="large" @click="updateUserPassword">确定</Button>
      </div>
    </Modal>


  </div>
</template>

<script>
  import {checkLogin, Logout, updateUser, uploadLogo} from "../../api";

    export default {
        name: "Tab",
      created(){
        this.checkLogin();
      },
      mounted(){
        // this.$nextTick(() => {
        //   this.checkLogin();
        // })
      },
      data(){
          return{
            active: 'chat',
            user: {},
            user_info: false,
            change_nickname_modal: false,   // 修改昵称模态框
            change_password_modal: false,   // 修改密码模态框

            // 新用户昵称
            new_nickname: '',

            /*---------  修改密码属性  ---------*/
            new_password: '',
            new_password_re: '',

            /*--------  用户消息相关属性  --------*/
            send_image: null,               // 选择发送图片
            setting_active: false,          // 用户设置框

            chat_setting_show: null,       // 用户设置
            del_friend_modal: false,       // 删除好友
            edit_remark_modal: false,      // 修改备注
            new_remark_name: '',            // 新备注名
          }
      },
      methods:{
        toMenu(menu){
          this.active = menu;
          this.$router.push('/pc/' + menu)
        },

        async checkLogin(){
          let resp = await checkLogin();
          console.log(resp);
          if(resp.code === 200){
            this.$User.setUser(resp.data);
            this.user = resp.data;
            // this.$socket.emit('in_chat');
          }else{
            this.$Message.warning(resp.message);
          }

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

        // 修改密码
        async updateUserPassword(){
          if(!this.new_password.trim()){this.$Message.warning('密码不能为空'); return}
          if(this.new_password.trim() !== this.re_new_password.trim()){this.$Message.warning('两次密码不一致'); return}

          let json_data = {
            password: this.new_password
          };
          let resp = await updateUser(json_data);
          if(resp.code === 200){
            this.$Message.success('密码修改成功');
            this.$router.go(-1);
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
            this.$router.go(0)
          }else{
            this.$Message.warning('用户退出登录异常');
          }
        },
      },
      watch:{
        // 监听URL状态改变
        "$route"(){
          let path = this.$route.path;
          console.log('path:',path);
          this.active = path.split('/')[path.split('/').length - 1]
        }
      }
    }
</script>

<style scoped>

</style>
