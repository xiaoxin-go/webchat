<template>
  <div>
    <!--  点击添加好友，搜索好友页面  -->
    <div class="wap-add-friend">
      <div class="wap-add-friend-title">
        <span class="wap-main-chat-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        <span class="wap-main-chat-title-name">
          添加朋友
        </span>
      </div>
      <div class="wap-add-friend-body">
        <div class="wap-add-friend-body-search">
          <Input search placeholder="好友名称" size="large" v-model="search_name" @on-search="searchFriend"/>
        </div>
        <Divider style="font-size: 14px; font-weight: normal;">好友列表</Divider>
        <div class="wap-add-friend-info">
          <div v-for="friend in friend_list">
            <div class="wap-main-friend-body">
              <div class="wap-main-friend-logo">
                <img :src="friend.logo" alt="">
              </div>
              <div class="wap-main-friend-info">
                <p class="wap-main-friend-nickname">昵称：{{friend.nickname}}</p>
                <Button size="small" style="margin-top:12px ;" @click="addFriend(friend.id)">添加</Button>
              </div>
            </div>
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
      if(!this.$User.name){
        this.$router.push('/login')
      }
    },
    data() {
      return {
        /*--------   添加好友属性   -------*/
        search_name: null,
        friend_list: [
          {
            'id': 1,
            'username': 'xiaoxin',
            'logo': '/static/images/mv1.jpg',
            'type': 'friend',
            'nickname': 'xiaoxin1',
            'remark_name': 'xiaoxin2'
          },
          {
            'id': 2,
            'username': 'xiaoxin1',
            'logo': '/static/images/mv2.png',
            'type': 'friend',
            'nickname': 'xiaoxin2',
            'remark_name': 'xiaoxin3'
          },
        ]
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
        let resp = await getUser(data);
        if(resp.code === 200){
          this.friend_list = resp.data
        }
      },
      // 添加好友
      async addFriend(friend_id){
        let json_data = {
          friend_id: friend_id
        };
        let resp = await addFriend(data);
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

<style scoped>

</style>
