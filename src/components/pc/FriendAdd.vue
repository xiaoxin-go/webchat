<template>
  <div id="right">
    <!--    好友信息页面    -->
    <div class="right-title">
      <p>添加好友</p>
    </div>
    <div class="right-main-body" style="padding-top: 80px;">
      <div style="text-align: left; padding: 10px;">
        <Input placeholder="请输入用户昵称" v-model="search_name" style="width: 160px;"/>
        <Button type="primary" style="margin-left: 10px;" @click="searchFriend">搜索</Button>
      </div>

      <template v-if="friend.id">
        <div class="pc-friend-info">
          <div class="wap-main-friend-logo" style="margin-left: 0;">
            <img :src="friend.logo" alt="">
          </div>
          <div class="wap-main-friend-info" style="width: 160px;text-align: left;">
            <p class="wap-main-friend-remark">{{friend.nickname}}</p>
          </div>
        </div  >
        <div class="pc-friend-btn" style="height: 120px;">
          <button @click="addFriend" v-if="friend.is_friend == 0">添加好友</button>
          <button @click="addFriend" disabled="disabled" v-else>已添加</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import {addFriend, getUser} from "../../api";

    export default {
      name: "FriendAdd",
      props:[],
      data(){
          return {
            search_name:'',
            friend:{}
          }
      },
      methods:{
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
            if(!resp.data.id){
              this.$Message.info('用户不存在')
            }
            this.friend = resp.data
          }else{
            this.$Message.error(resp.message)
          }
        },
        // 添加好友
        async addFriend(){
          let json_data = {
            friend_id: this.friend.id
          };
          let resp = await addFriend(json_data);
          if(resp.code === 200){
            this.$Message.success('好友添加成功');
            this.$router.push('/pc/friend')
          }else{
            this.$Message.warning(resp.message)
          }
        },
      },
    }
</script>

<style scoped>

</style>
