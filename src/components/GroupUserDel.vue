<template>
  <div class="wap-main">
    <!--  点击群聊，群聊资料页面  -->
    <div class="wap-main-group">
      <div class="wap-group-info-title">
        <span class="wap-main-chat-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        <span class="wap-main-chat-title-name">
          选择联系人
        </span>
      </div>
        <div class="wap-main-body-friend-search">
          <Input v-model="search_name" search placeholder="搜索" size="large"/>
        </div>

        <!-- 好友 -->
        <div class="wap-main-body-friend-body">
            <template v-for="(friend, index) in group_user_list">
              <div @click="delGroupUser(friend.id)" class="chat-item" v-if="friend.nickname.startsWith(search_name) && friend.nickname !== user.nickname">
                <div class="chat-img">
                  <img :src="friend.logo">
                </div>
                <div class="chat-text">
                  {{ friend.nickname }}
                </div>
              </div>
            </template>
        </div>
    </div>
  </div>

</template>

<script>
  import {getGroupUser, deleteGroupUser, checkLogin} from "../api";

  export default {
    name: "GroupUserDel",
    mounted() {
        this.group_id = this.$route.params.id;
        this.getGroupUser();
    },
    data() {
      return {
        user: {},
        group_id: null,
        search_name: '',
        member_list: [],
        group_user_list: [
        ],
      }
    },
    methods: {
      // 获取群组消息
      async getGroupUser() {
        let json_data = {
          group_id: this.group_id
        };
        let resp = await getGroupUser(json_data);
        console.log(resp);
        if (resp.code === 200) {
          this.group_user_list = resp.data;
        } else {
          this.$Message.error(resp.message);
        }
      },


      // 添加成员
      async delGroupUser(user_id) {
        let json_data = {
          group_id: this.group_id,
          to_user_id: user_id
        };
        let resp = await deleteGroupUser(json_data);
        console.log(resp);
        if (resp.code === 200) {
          this.$Message.success('用户删除成功');
          this.$router.go(-1);
        } else {
          this.$Message.error(resp.message)
        }
      },
    },
  }
</script>

<style scoped>
</style>
