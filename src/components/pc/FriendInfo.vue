<template>
  <div id="right">
    <!--    好友信息页面    -->
    <div class="right-title">
      <p>{{friend.username}}</p>
    </div>
    <div class="right-main-body" style="padding-top: 80px;">
      <template v-if="friend.id">
        <div class="pc-friend-info">
          <div class="wap-main-friend-logo" style="margin-left: 0;">
            <img :src="friend.logo" alt="">
          </div>
          <div class="wap-main-friend-info" style="width: 160px;text-align: left;">
            <p class="wap-main-friend-remark">{{friend.nickname}}</p>
            <p class="wap-main-friend-nickname">备注：
              <input type="text" v-model="new_remark_name" v-if="update_nickname_active" v-focus="update_nickname_active" id="update-remark" @blur="editRemark">
              <template v-else>
                {{friend.remark}}
              </template>
              <Icon type="md-create" class="pc-friend-remark" size="13" alt="修改昵称" @click="update_nickname_active=true"/>
            </p>
          </div>
      </div  >
      <div class="pc-friend-btn" style="height: 120px;">
        <button @click="changeChat">发消息</button>
        <button class="del-group" @click="del_friend_modal=true">删除好友</button>
        <button class="set-admin" @click="setAdmin">设为站长</button>
        <button class="set-admin" @click="cancelAdmin">取消站长</button>
      </div>
      </template>
    </div>
    <!--  删除好友模态框 -->
    <Modal
      v-model="del_friend_modal"
      @on-cancel="del_friend_modal=false"
      title="删除好友"
      class-name="my-modal" width="400px">
      <div class="my-modal-text">
        <span>您确定删除好友 <span style="color: #cc99ff;">{{friend.username}}</span> 吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="del_friend_modal=false">取消</Button>
        <Button type="primary" size="large" @click="delFriend">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    addChat,
    deleteFriend,
    updateFriend,
    updateUser
  } from "../../api";

    export default {
      name: "FriendInfo",
      props:['friend'],
      data(){
          return {
            update_nickname_active: false,
            hover_active_id: null,
            del_friend_modal:false,
            new_remark_name: this.friend.remark,
          }
      },
      methods:{
        // 更新好友资料
        async editRemark() {
          if (!this.new_remark_name.trim()) {
            this.$Message.warning('备注名不能为空！');
            return
          }
          this.update_nickname_active = false;
          let json_data = {
            friend_id: this.friend.id,
            remark: this.new_remark_name
          };
          let resp = await updateFriend(json_data);
          if (resp.code !== 200) {
             this.$Message.warning(resp.message);
          }
        },

        // 删除好友
        async delFriend() {
          let json_data = {
            friend_id: this.friend.id
          };
          let resp = await deleteFriend(json_data);
          if (resp.state === 200) {
            this.$Message.success('好友删除成功');
            this.$router.push('/friend');
          } else {
            this.$Message.error(resp.message)
          }
        },

        // 设置为站长
        async setAdmin() {
          let json_data = {
            type: 1
          };
          let resp = await updateUser(json_data);
          if (resp.state === 200) {
            this.$Message.success('设置成功');
            this.friend.type = 1;
          } else {
            this.$Message.warning(resp.message)
          }
        },

        // 撤消站长
        async cancelAdmin() {
          let json_data = {
            type: 2
          };
          let resp = await updateUser(json_data);
          if (resp.state === 200) {
            this.$Message.success('取消成功');
            this.friend.type = 2
          } else {
            this.$Message.warning(resp.message)
          }
        },

        // 进入聊天页面，先请求添加聊天接口，返回聊天ID
        async changeChat() {
          this.friend.chat_type = 1;
          let resp = await addChat(this.friend);
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
      },
      directives: {	   
        focus: {	       
          inserted: function (el, {value}) {	       
            console.log(el,{value});	           
            if (value) {	               
              el.focus();	           
            }	       
          }	   
        }
      }
    }
</script>

<style scoped>

</style>
