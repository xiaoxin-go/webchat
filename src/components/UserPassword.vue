<template>
  <div class="wap-main">
    <!--  点击群聊，群聊资料页面  -->
    <div class="wap-main-group">
      <div class="wap-group-info-title">
        <span class="wap-main-chat-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        <span class="wap-main-chat-title-name">
          修改密码
        </span>
        <!--<span style="position: absolute; right: 10px;">-->
          <!--<Button @click="updateUserPassword" type="success" size="small">确定</Button>-->
          <!--</span>-->
      </div>
      <div class="wap-group-info">
        <div class="input-group">
          <p class="password-text">新密码：</p>
          <div class="login-input">
            <Input type="password" v-model="new_password" width="auto"/>
          </div>
        </div>
        <div class="input-group">
          <p class="password-text">重复密码：</p>
          <div class="login-input">
            <Input type="password" v-model="re_new_password" width="auto"/>
          </div>
        </div>
        <div style="padding: 2px;margin-top: 15px;"><Button long type="primary" @click="updateUserPassword">确定</Button></div>
      </div>

    </div>
  </div>

</template>

<script>
  import {updateUser} from '../api/index.js'
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
        new_password: '',
        re_new_password: '',
      }
    },
    methods: {
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
