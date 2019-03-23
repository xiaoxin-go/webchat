<template>
  <div class="wap-main">
    <!--  点击好友，好友资料页面 -->
    <div class="wap-main-friend">
      <div class="wap-main-friend-title">
        <span class="wap-main-friend-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        <span class="wap-main-chat-title-name">
          好友信息
        </span>
      </div>

      <div class="wap-main-friend-body">
        <div class="wap-main-friend-logo">
          <img :src="friend.logo" alt="">
        </div>
        <div class="wap-main-friend-info">
          <p class="wap-main-friend-remark">{{friend.remark}}</p>
          <p class="wap-main-friend-nickname">昵称：{{friend.nickname}}</p>
        </div>
      </div>
      <div class="wap-main-friend-bottom">
        <div class="wap-main-friend-update-remark" @click="edit_remark_modal=true">修改备注</div>
        <div class="wap-main-friend-update-remark" v-if="user.type === 0 && friend.type === 2" @click="updateUser">
          设置为站长
        </div>
        <div class="wap-main-friend-sendmessage" @click="changeChat(friend)">发消息</div>
        <div class="wap-main-friend-delete">
          <Button long type="error" @click="del_friend_modal=true">删除好友</Button>
        </div>
      </div>
    </div>

    <!--  删除好友模态框 -->
    <Modal
      v-model="del_friend_modal"
      @on-cancel="del_friend_modal=false"
      title="删除好友"
      class-name="wap-my-modal">
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
      title="修改备注"
      class-name="wap-my-modal">
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
  import {updateFriend, deleteFriend, updateUser, getUserInfo, addChat, checkLogin} from "../api";

  export default {
    name: "FriendInfo",
    mounted() {
      this.friend_id = this.$route.params.id;
      this.checkLogin();
      this.getUserInfo();
    },
    created() {

    },
    computed: {
      // friend_info(){
      //   console.log(this.$router.params.friend);
      //   return this.$route.params.friend
      // }
    },
    data() {
      return {
        user: {},
        friend: {},
        friend_id: '',
        del_friend_modal: null,
        edit_remark_modal: null,
        new_remark_name: null,
      }
    },
    methods: {
      async checkLogin() {
        let resp = await checkLogin();
        if (resp.code === 200) {
          this.user = resp.data;
        }
      },

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
        let json_data = {
          'user_id': this.friend_id,
        };
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

      // 进入聊天页面，先请求添加聊天接口，返回聊天ID
      async changeChat(friend) {
        friend.chat_type = 1;
        let resp = await addChat(friend);
        if (resp.code === 200) {
          let chat_id = resp.data;
          this.$router.push(`/chat/${chat_id}`)
        } else {
          this.$Message.warning(resp.message)
        }
      },
    },
  }
</script>

<style scoped>

</style>
