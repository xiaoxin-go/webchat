<template>
  <div id="main" style="background: #f5f5f5; height: 100%; padding-top: 15%;">
    <div class="login-body">
      <Card :bordered="false">
        <p slot="title">用户登录</p>
        <div class="login-group">
          <span class="login-text">用户名：</span>
          <div class="login-input">
            <Input type="text" v-model="username" width="auto"/>
          </div>
        </div>

        <div class="login-group">
          <span class="login-text">密码：</span>
          <div class="login-input">
            <Input type="password" v-model="password" width="auto"/>
          </div>
        </div>

        <div style="text-align: right; padding-right: 18px;">
          <Button type="primary" @click="login">登录</Button>
          <Button @click="to_register" style="margin-left: 10px;">注册</Button>
        </div>
      </Card>
    </div>
  </div>


</template>

<script>
  import {Login} from '../api/index.js'

  export default {
    name: 'Login',
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      // 登录函数
      async login () {
        if (!this.username.trim()) {
          this.$Message.warning('用户名不能为空');
          return
        }
        if (!this.password.trim()) {
          this.$Message.warning('用户密码不能为空');
          return
        }
        let json_data = {
          username: this.username.trim(),
          password: this.password.trim()
        };
        // if (this.username === 'xiaoxin' && this.password === 'xiaoxin') {
        //   this.$User.setUser({
        //     logo: '/static/images/mv1.jpg',
        //     nickname: 'xiaoxin',
        //     username: 'xiaoxin',
        //     type: 0
        //   });
        //   this.send();
        //   this.$router.push('/');
        //   return
        // }
        let resp = await Login(json_data);
        if (resp.code === 200) {
          // this.$Message.success('用户登录成功');
          this.$User.setUser(resp.data);
          this.$router.push('/')
        } else{
          this.$Message.error(resp.message)
        }
      },


      /*------------------  socketio交互 -----------------*/
      send() {
        console.log('send.......');
        this.$socket.emit('new_login')
      },

      // 跳转到注册页面
      to_register () {
        this.$router.push('/register')
      }

    }
  }
</script>

<style>
</style>
