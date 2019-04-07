<template>
  <!--右侧消息框-->
  <div id="right">
    <!--    用户聊天界面    -->
    <div class="right-title">
      <template v-if="group.name"></template>
      <p>{{group.name}} ({{data_list.length}})</p>
    </div>
    <div class="right-main-body" style="padding-top: 80px;">
      <template v-if="group.name">
        <div class="pc-group-info-body">
          <div class="pc-group-info">
            <div class="wap-group-info-item" v-for="(user, index) in data_list">
              <div class="wap-group-info-logo" @mouseover="hoverUser(user)" @mouseout="hover_active_id=null">
                <img :src="user.logo" alt="">
                <div class="pc-group-user-item-card" v-if="hover_active_id===user.id" @mouseout="hover_active_id=null">
                  <p @click="delGroupUser" v-if="$User.user.type === 0 || group_user_type === 0">删除成员</p>
                  <p @click="addFriend" v-if="group_user_type < 2">添加好友</p>
                  <p @click="addAdmin" v-if="group_user_type === 0 && user.type === 2">设置管理员</p>
                  <p @click="delAdmin" v-if="group_user_type === 0 && user.type === 1">取消管理员</p>
                </div>
              </div>
              <div class="wap-group-info-name">
                {{user.nickname}}
              </div>
            </div>
            <!--  群组添加成员按钮  -->
            <template>
              <div class="wap-group-info-item" @click="clickGroupUserAdd">
                <div class="wap-group-info-logo">
                  <img src="../../../static/images/add.jpg" alt="">
                </div>
                <div class="wap-group-info-name">
                  <p>&nbsp;</p>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="pc-group-btn">
          <button @click="changeChat">发消息</button>
          <button class="del-group" @click="del_group_modal=true" v-if="$User.user.type === 0 || group_user_type === 0">解散群聊</button>
        </div>
      </template>
    </div>
    <Modal
      v-model="group_add_modal"
      @on-cancel="group_add_modal=false"
      class="group-add-modal"
      title="邀请好友">
      <!-- 当前好友列表 -->
      <div class="friend-list">
        <div class="group-add-search">
          <Input type="text" v-model="search_name">
            <Icon type="ios-search" slot="prefix" />
          </Input>
        </div>
        <div v-for="friend in friend_list" class="group-add-item" @click="selectFriend(friend)"
             v-if="((friend.remark && friend.remark.startsWith(search_name)) || friend.nickname.startsWith(search_name))">
          <div class="chat-img">
            <img :src="friend.logo">
          </div>
          <div class="chat-text" style="{{'color:'user.type==0?'brown':(user.type==1?'blue':'black')}}">
            {{friend.remark || friend.nickname}}
          </div>
          <div :class="'friend-list-input ' + (isSelectFriend(friend)?'select':'')">
            <Icon type="ios-checkmark" size="26"/>
          </div>
        </div>
      </div>
      <!-- 选中好友列表 -->
      <div class="select-friend-list">
        <div class="select-friend-list-title">
          {{select_friend_list.length>0?('已选择了('+ select_friend_list.length +')个好友'):'请选择需要添加的好友'}}
        </div>
        <div v-for="friend in select_friend_list" class="select-friend-item" @click="selectFriend(friend)">
          <div class="chat-img">
            <img :src="friend.logo">
          </div>
          <div class="chat-text">
            {{friend.remark || friend.nickname}}
          </div>
          <div class="friend-list-input">
            <Icon type="ios-close" size="22"/>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="addGroupUser" :disabled="select_friend_list.length===0">确定</Button>
        <Button type="text" size="large" @click="group_add_modal=false">取消</Button>
      </div>
    </Modal>
    <!-- 退出群聊，模态框 -->
    <Modal
      v-model="del_group_modal"
      @on-cancel="del_group_modal=false"
      title="解散群聊" width="400px">
      <div class="wap-my-modal-text">
        <span>您确定解散该群吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" @click="del_group_modal=false">取消</Button>
        <Button type="primary" @click="delGroup">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    addChat,
    addFriend,
    addGroupUser,
    deleteGroup,
    deleteGroupUser,
    getFriend,
    getGroupUser,
    updateGroupUser
  } from "../../api";

    export default {
      name: "GroupUser",
      props:['group'],
      data(){
          return {
            group_user_type: null,
            hover_active_id: null,
            active_user: {},
            group_add_modal:false,
            del_group_modal:false,
            search_name: '',
            group_user_ids:[],
            select_friend_list: [],
            friend_id_list: [],
            friend_list: [],
            data_list: [],
          }
      },
      methods:{
        //
        hoverUser(user){
          this.active_user = user;
          this.hover_active_id = user.id;
        },
        clickGroupUserAdd(){
          // this.getFriend();
          this.group_add_modal = true;
        },

        // 获取群组成员列表
        async getGroupUser(){
          let json_data = {
            group_id: this.group.id,
          };
          let resp = await getGroupUser(json_data);
          console.log(resp);
          if (resp.code === 200){
            this.getFriend();
            this.data_list = resp.data.data_list;
            this.group_user_type = resp.data.group_type;
            this.group_user_ids = this.data_list.map(item=>item.id)
          }else{
            this.$Message.error(resp.message);
          }
        },
        // 获取好友信息
        async getFriend() {
          let resp = await getFriend();
          console.log(resp);
          if (resp.code === 200) {
            this.friend_list = resp.data.filter(item=>this.group_user_ids.indexOf(item.id)===-1);
            this.friend_id_list = resp.data.map(item=>item.id);
          } else {
            this.$Message.error(resp.message);
          }
        },
        // 点击好友添加到选中好友列表
        selectFriend(friend){
          let index = this.select_friend_list.indexOf(friend);
          if(index >=0 ){
            this.select_friend_list.splice(index,1);
          }else{
            this.select_friend_list.push(friend);
          }
        },

        // 判断好友是否被选中
        isSelectFriend(friend){
          let index = this.select_friend_list.indexOf(friend);
          if(index >= 0){
            return true
          }
        },

        // 添加好友
        async addFriend(){
          let json_data = {
            friend_id: this.active_user.id
          };
          let resp = await addFriend(json_data);
          console.log(resp);
          if(resp.code === 200){
            this.$Message.success('好友添加成功');
            this.getGroupUser();
          }else{
            this.$Message.warning(resp.message)
          }
        },

        // 添加成员
        async addGroupUser() {
          console.log(this.member_list);
          let json_data = {
            group_id: this.group_id,
            member_list: this.member_list
          };
          let resp = await addGroupUser(json_data);
          if (resp.code === 200) {
            this.$Message.success('添加成功');
            this.getGroupUser();
          } else {
            this.$Message.error(resp.message)
          }
        },

        // 添加管理员
        async addAdmin(){
          let json_data = {
            group_id: this.group.id,
            to_user_id: this.active_user.id,
            group_type: 1
          };
          let resp = await updateGroupUser(json_data);
          if (resp.code === 200){
            this.$Message.success('设置成功');
            this.getGroupUser();
          }else{
            this.$Message.error(resp.message)
          }
        },

        // 删除管理员
        async delAdmin(){
          let json_data = {
            group_id: this.group_id,
            to_user_id: this.active_user.id,
            group_type: 2
          };
          let resp = await updateGroupUser(json_data);
          console.log(resp);
          if (resp.code === 200){
            this.$Message.success('取消成功');
            this.getGroupUser()
          }else{
            this.$Message.error(resp.message)
          }
        },

        // 删除成员
        async delGroupUser() {
          let json_data = {
            group_id: this.group.id,
            to_user_id: this.active_user.id
          };
          let resp = await deleteGroupUser(json_data);
          console.log(resp);
          if (resp.code === 200) {
            this.$Message.success('用户删除成功');
            this.getGroupUser();
          } else {
            this.$Message.error(resp.message)
          }
        },

        // 进入聊天页面，先请求添加聊天接口，返回聊天ID
        async changeChat() {
          this.group.chat_type = 2;
          console.log(this.group);
          let resp = await addChat(this.group);
          console.log(resp);
          if (resp.code === 200) {
            let chat_id = resp.data;
            this.$router.push({
              name: 'pcChat',
              params: {
                chat_id: chat_id
              }
            })
          } else {
            this.$Message.warning(resp.message)
          }
        },

        // 删除群聊
        async delGroup(){
          let json_data = {
            group_id: this.group.id
          };
          let resp = await deleteGroup(json_data);
          if (resp.code === 200){
            this.$Message.success('群组删除成功');
            this.$router.push('/pc/group')
          }else{
            this.$Message.error(resp.message);
          }
        },

      }
    }
</script>

<style scoped>

</style>
