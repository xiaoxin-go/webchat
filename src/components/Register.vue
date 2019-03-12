<template>
  <div id="main" style="background: #f5f5f5; height: 100%; padding-top: 15%;">
    <div class="login-body">
    <Card :bordered="false">
      <p slot="title">用户登录</p>

      <div class="login-group">
        <span class="login-text">用户账号：</span>
        <div class="login-input">
          <Input type="text" v-model="username" width="auto"/>
        </div>
      </div>

      <div class="login-group">
        <span class="login-text">用户昵称：</span>
        <div class="login-input">
          <Input type="text" v-model="nickname" width="auto"/>
        </div>
      </div>

      <div class="login-group">
        <span class="login-text">密码：</span>
        <div class="login-input">
          <Input type="password" v-model="password" width="auto"/>
        </div>
      </div>

      <div class="login-group">
        <span class="login-text">重复密码：</span>
        <div class="login-input">
          <Input type="password" v-model="repassword" width="auto"/>
        </div>
      </div>

      <div style="text-align: right; padding-right: 18px;">
        <Button type="primary" @click="register">注册</Button>
        <Button @click="to_login" style="margin-left: 10px;">登录</Button>
      </div>


    </Card>
    </div>

  </div>

</template>

<script>
  import {Login, Register} from '../api/index.js'
  export default {
    name: 'Login',
    data() {
      return {
        username: '',
        password: '',
        repassword: '',
        nickname: ''
      }
    },
    methods:{
      // 用户注册
      async register(){
        if(!this.username.trim()){this.$Message.warning('用户名不能为空'); return}
        if(!this.nickname.trim()){this.$Message.warning('用户昵称不能为空'); return}
        if(!this.password.trim()){this.$Message.warning('用户密码不能为空'); return}
        if(!this.repassword.trim()){this.$Message.warning('请重复密码'); return}
        if(this.password.trim() !== this.repassword.trim()){this.$Message.warning('两次密码不一致'); return}

        let json_data = {
          username: this.username.trim(),
          nickname: this.nickname.trim(),
          password: this.password.trim()
        };
        let resp = await Register(json_data);
        if(resp.code === 200){
          this.$Message.success('用户注册成功');
          this.$router.push('/')
        }else{
          this.$Message.error(resp.message)
        }
      },

      // 跳转到注册页面
      to_login(){
        this.$router.push('/login')
      }

    }
  }
</script>

<style scoped>

</style>
