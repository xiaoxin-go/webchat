<template>
  <div id="main" style="height: 100%;">
    <div id="left">
      <div class="user" @mouseleave="user_info=false">
        <img :src="user.logo" alt="" @click="changeLogo" @mouseover="user_info=true">
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
    </div>

    <!--  修改用户昵称模态框  -->
    <Modal
      v-model="change_nickname_modal"
      @on-cancel="modalCancel"
      title="修改昵称"
      class-name="my-modal" width="400px">
      <div class="my-modal-input">
        <input type="text" placeholder="请输入新昵称" v-model="new_nickname">
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="changeNickname">确定</Button>
      </div>
    </Modal>

    <!--  修改用户密码模态框 -->
    <Modal
      v-model="change_password_modal"
      @on-cancel="modalCancel"
      title="修改密码"
      class-name="my-modal" width="400px">
      <div class="my-modal-input">
        <input type="text" placeholder="请输入旧密码" v-model="old_password">
      </div>
      <div class="my-modal-input">
        <input type="text" placeholder="请输入新密码" v-model="new_password">
      </div>
      <div class="my-modal-input">
        <input type="text" placeholder="重复输入新密码" v-model="new_password_re">
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="changePassword">确定</Button>
      </div>
    </Modal>


  </div>

</template>

<script>
  import {uploadLogo, updateUser, Logout} from '../../api/index.js';
  import {checkLogin} from "../../api";

  export default {
    name: 'Home',
    mounted() {
      this.checkLogin();
    },
    data(){
      return {
        user: {},
        nickname: 'xiaoxin',
        username: 'xiaoxin',
        user_info: false,
        logo: '/static/images/index.png',    // 默认logo
        change_nickname_modal: false,   // 修改昵称模态框
        change_password_modal: false,   // 修改密码模态框

        // 新用户昵称
        new_nickname: '',

        /*---------  修改密码属性  ---------*/
        old_password: '',
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
    created(){
    },
    /*****************************************    方法区    ******************************************/
    methods:{
      async checkLogin(){
        this.user = {
          username: 'xiaoxin',
          nickname: '小新',
          logo: '/static/images/mv1.jpg'
        };
        return;
        let resp = await checkLogin();
        console.log(resp);
        if(resp.code === 200){
          this.user = resp.data;
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
          this.$router.push('/')
        }else{
          this.$Message.warning('用户退出登录异常');
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



      /*------------------         公共方法               -------------------------*/
      // 取消模态框
      modalCancel(){
        this.change_password_modal = false;
        this.change_nickname_modal = false;

        this.new_nickname = '';
        this.old_password = '';
        this.new_password = '';
        this.new_password_re = '';
      },


      // 更换头像
      changeLogo(){
        document.getElementById('logo_file').click();
      },


    },
  }
</script>

<style>

</style>
