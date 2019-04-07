<template>
  <div style="height: 100%;">

    <!--聊天列表-->
    <div id="center">
      <div class="search">
        <Input type="text" @keyup.enter.native="search" placeholder="search..." v-model="search_value">
          <Icon type="ios-search" slot="prefix" />
        </Input>
      </div>

      <!------------------       好友列表     ----------------->
      <div class="center-body">
        <div class="center-item" v-if="$User.user.type < 2">
          <div class="create-group" @click="friend_add_active=true">
            <div class="create-group-img">
              <img src="/static/images/search_add_friend.png">
            </div>
            <div class="create-group-text">
              添加好友
            </div>
          </div>
        </div>

        <div class="chat-title">
          好友列表{{friend_list.length===0?'':(' (' + friend_list.length + '人)')}}
        </div>

        <!-- 好友 -->
        <div class="friend-body">
          <template v-for="(friend, index) in friend_list" v-if="(friend.remark_name && friend.remark_name.startsWith(search_value)) || (friend.nickname && friend.nickname.startsWith(search_value))">
            <div :class="'chat-item ' + (friend_active===index?'active':'')" @click="changeFriend(index)">
              <div class="chat-img">
                <img :src="friend.logo">
              </div>
              <div class="chat-text">
                {{ friend.remark }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <FriendAdd v-if="friend_add_active"></FriendAdd>
    <!--右侧消息框-->
    <FriendInfo v-else :friend="select_friend"></FriendInfo>
  </div>

</template>

<script>
  import {getFriend, addFriend, getUser} from '../../api/index.js';
  import FriendInfo from './FriendInfo.vue'
  import FriendAdd from './FriendAdd.vue'

  export default {
    name: 'Home',
    components:{FriendInfo, FriendAdd},
    data(){
      return {
        friend_add_active: false,
        search_value: '',     // 搜索框内容
        select_friend:{},
        // 好友搜索
        group_add_search:'',

        /*-----------   好友相关属性  -------------*/
        // 当前选择好友
        friend_active: '',
        // 添加好友模态框
        add_friend_modal: false,
        del_friend_modal: false,

        // 好友列表
        friend_list:[]
      }
    },
    created(){
      this.getFriend();
    },
    mounted(){
    },
    /*****************************************    方法区    ******************************************/
    methods:{
      // 获取好友列表
      async getFriend(){
        let resp = await getFriend();
        if(resp.code === 200){
          this.friend_list = resp.data;
        }else{
          this.$Message.error(resp.message)
        }
      },

      // 点击好友头像
      changeFriend(index){
        this.friend_add_active = false;
        this.friend_active = index;
        this.select_friend = this.friend_list[index]
      },

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
    watch:{
      // 监听URL状态改变
      "$User.user"(){
        console.log(this.$User.user)
      }
    }
  }
</script>

<style>

</style>
