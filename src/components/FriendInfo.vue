<template>
    <div class="wap-main">
      <!--  点击好友，好友资料页面 -->
      <div class="wap-main-friend">
        <div class="wap-main-friend-title">
        <span class="wap-main-friend-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        </div>

        <div class="wap-main-friend-body">
          <div class="wap-main-friend-logo">
            <img :src="friend.logo" alt="">
          </div>
          <div class="wap-main-friend-info">
            <p class="wap-main-friend-remark">{{friend.remark_name}}</p>
            <p class="wap-main-friend-nickname">昵称：{{friend.nickname}}</p>
          </div>
        </div>
        <div class="wap-main-friend-bottom">
          <div class="wap-main-friend-update-remark" @click="edit_remark_modal=true">修改备注</div>
          <div class="wap-main-friend-sendmessage" @click="toChat(frieno)">发消息</div>
          <div class="wap-main-friend-delete"><Button long type="error" @click="del_friend_modal=true">删除好友</Button></div>
        </div>
      </div>

      <!-- 退出群组，模态框 -->

    </div>

</template>

<script>
    export default {
        name: "WapChat",
      mounted() {
        if(!this.$User.name){
          this.$router.push('/login')
        }
        this.friend = this.$route.params.friend
      },
      created(){

      },
      computed:{
        // friend_info(){
        //   console.log(this.$router.params.friend);
        //   return this.$route.params.friend
        // }
      },
      data(){
        return {
          friend:{},
          del_friend_modal: null,
        }
      },
      methods:{

      },
      sockets:{
        connect: function(){
          console.log('socket connected')
        },
        message: function(){
          console.log('返回' + val)
        }
      },
    }
</script>

<style scoped>

</style>
