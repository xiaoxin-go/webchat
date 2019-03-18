<template>
  <div class="wap-main">
    <!--  点击群聊，群聊资料页面  -->
    <div class="wap-main-group">
      <div class="wap-group-info-title">
        <span class="wap-main-chat-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        <span class="wap-main-chat-title-name">
          管理员列表
        </span>
        <span style="position: absolute; right: 10px;">
          <Button @click="$router.push(`/group_admin_add/${group_id}`)" type="success" size="small">添加</Button>
        </span>
      </div>
        <div class="wap-main-body-friend-search">
          <Input v-model="search_name" search placeholder="搜索" size="large"/>
        </div>

        <!-- 好友 -->
        <div class="wap-main-body-friend-body">
            <template v-for="friend in group_user_list" v-if="friend.type === 1 & friend.remark_name.startsWith(search_name)">
              <div class="chat-item">
                <div class="chat-img">
                  <img :src="friend.logo">
                </div>
                <div class="chat-text">
                  {{ friend.remark_name }}
                  <div style="display: inline-block; position: absolute; right: 10px;">
                    <Icon type="ios-remove-circle-outline" size="20" @click="delAdmin(friend.id)" style="color: orangered;font-weight: bold;" />
                  </div>
                </div>

              </div>
            </template>
        </div>
    </div>
  </div>

</template>

<script>
  import {getGroupUser,updateGroupUser} from "../api";

  export default {
    name: "WapChat",
    mounted() {
      if (!this.$User.user) {
        this.$router.push('/login')
      } else {
        this.group_id = this.$route.params.id;
        this.getGroupUser();
      }
    },
    data() {
      return {
        group_id: null,
        search_name: '',
        member_list: [],
        group_user_list: [],
      }
    },
    methods: {
      // 获取群组消息
      async getGroupUser() {
        let json_data = {
          group_id: this.group_id
        };
        let resp = await getGroupUser(json_data);
        if (resp.code === 200) {
          this.group_user_list = resp.data;
        } else {
          this.$Message.error(resp.message);
        }
      },

      // 添加成员
      async delAdmin(user_id){
        let json_data = {
          group_id: this.group_id,
          to_user_id: user_id,
          group_type: 2
        };
        let resp = await updateGroupUser(json_data);
        if (resp.code === 200){
          this.getGroupUser()
        }else{
          this.$Message.error(resp.message)
        }
      },
    },
  }
</script>

<style scoped>
</style>
