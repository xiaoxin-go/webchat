<template>
  <div>
    <!--  点击添加好友，搜索好友页面  -->
    <div class="wap-add-friend">
      <div class="wap-group-info-title">
        <span class="wap-main-chat-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        <span class="wap-main-chat-title-name">
          添加好友
        </span>
      </div>
      <div class="wap-add-friend-body">
        <div class="wap-add-friend-body-search">
          <Input search placeholder="好友名称" size="large" v-model="search_name" @on-search="searchFriend"/>
        </div>
        <Divider style="font-size: 14px; font-weight: normal;">好友列表</Divider>
        <div class="wap-add-friend-info" v-if="friend.id">
              <div class="wap-friend-add-logo">
                <img :src="friend.logo" alt="">
              </div>
              <div class="wap-add-friend-info-info">
                <p class="wap-add-friend-nickname">昵称：{{friend.nickname}}</p>
                <Button size="small" style="margin-top:12px ;" @click="addFriend">添加</Button>
              </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {addFriend,  getUser} from '../api/index.js'
  export default {
    name: "Wap",
    mounted() {
      if(!this.$User.user){
        this.$router.push('/login')
      }
    },
    data() {
      return {
        /*--------   添加好友属性   -------*/
        search_name: null,
        friend:
          {
            'id': 1,
            'username': 'xiaoxin',
            'logo': '/static/images/mv1.jpg',
            'type': 'friend',
            'nickname': 'xiaoxin1',
            'remark_name': 'xiaoxin2'
          },
      }
    },
    methods: {
      // 查找好友
      async searchFriend(){
        if(!this.search_name || !this.search_name.trim()){
          this.$Message.warning('请输入好友名称！');
          return
        }
        let json_data = {
          username: this.search_name
        };
        let resp = await getUser(json_data);
        if(resp.code === 200){
          console.log(resp.data);
          this.friend = resp.data
        }
      },
      // 添加好友
      async addFriend(){
        let json_data = {
          friend_id: this.friend.id
        };
        let resp = await addFriend(json_data);
        if(resp.code === 200){
          this.$Message.success('好友添加成功')
        }else{
          this.$Message.warning(resp.message)
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
      getMessage(data) {
        if (data) {
          return data[data.length - 1].message
        }
      },
      getAddTime(data) {
        if (data) {
          return data[data.length - 1].add_time
        }
      }
    },
  }
</script>

<style scoped>

</style>
