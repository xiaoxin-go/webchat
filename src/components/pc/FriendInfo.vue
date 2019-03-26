<template>
  <div class="settings-show">
    <div class="settings-chat">
      <img :src="friend.logo" alt="">
      <p>{{friend.nickname}}</p>
      <p class="username">ID: {{friend.username}}</p>
    </div>
    <div class="settings-chat-item" @click="edit_remark_modal=true">
      <span>修改备注</span><span class="settings-chat-item-icon"><Icon type="ios-arrow-forward" size="22"/></span>
    </div>
    <div class="settings-chat-item" @click="del_friend_modal=true">
      删除好友
    </div>

    <!--  删除好友模态框 -->
    <Modal
      v-model="del_friend_modal"
      @on-cancel="del_friend_modal=false"
      title="删除好友" width="400px">
      <div class="wap-my-modal-text">
        <span>您确定删除好友 <span style="color: #cc99ff;">{{friend.remark_name}}</span> 吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" @click="del_friend_modal=false">取消</Button>
        <Button type="primary" @click="delFriend">确定</Button>
      </div>
    </Modal>

    <!--  修改备注模态框 -->
    <Modal
      v-model="edit_remark_modal"
      @on-cancel="edit_remark_modal=false"
      title="修改备注" width="400px">
      <div class="wap-my-modal-text">
        <Input placeholder="请输入备注名称" autofocus v-model="new_remark_name"/>
      </div>
      <div slot="footer">
        <Button type="text" @click="edit_remark_modal=false">取消</Button>
        <Button type="primary" @click="editRemark">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {deleteFriend, getUserInfo, updateFriend, updateUser} from "../../api";

    export default {
        name: "FriendInfo",
        data(){
          return{
            friend: {},
            edit_remark_modal: false,     // 修改好友备注模态框
            del_friend_modal: false,      // 删除好友模态框
            new_remark_name: '',
          }
        },
      mounted() {
        this.getUserInfo();
      },
      props:['friend_id'],
      methods:{
        // 更新好友资料
        async editRemark() {
          if (!this.new_remark_name || !this.new_remark_name.trim()) {
            this.$Message.warning('备注名不能为空！');
            return
          }
          let json_data = {
            friend_id: this.friend.id,
            remark: this.new_remark_name
          };
          let resp = await updateFriend(json_data);
          if (resp.code === 200) {
            this.friend.remark_name = this.remark_name;
            this.edit_remark_modal = false;
          } else {
            this.$Message.warning(resp.message);
          }
        },

        // 获取好友信息
        async getUserInfo() {
          console.log(this.friend_id);
          let json_data = {
            'user_id': this.friend_id,
          };
          this.friend = {'username': 'test', 'logo': '/static/images/index.png', 'type': 'group', 'remark_name': 'test'};
          let resp = await getUserInfo(json_data);
          console.log(resp);
          if (resp.code === 200) {
            this.friend = resp.data;
          } else {
            this.$Message.error(resp.message);
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
        async updateUser() {
          let json_data = {
            type: 1
          };
          let resp = await updateUser(json_data);
          if (resp.state === 200) {
            this.$Message.success('设置成功');
          } else {
            this.$Message.warning(resp.message)
          }
        },
      }
    }
</script>

<style scoped>

</style>
