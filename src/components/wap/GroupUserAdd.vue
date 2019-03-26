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
        <span style="position: absolute; right: 10px;">
          <Button @click="addGroupUser" type="success" :disabled="member_list.length===0" size="small">确定</Button>
          </span>
      </div>
        <div class="wap-main-body-friend-search">
          <Input v-model="search_name" search placeholder="搜索" size="large"/>
        </div>

        <!-- 好友 -->
        <div class="wap-main-body-friend-body">
          <CheckboxGroup v-model="member_list">
            <template v-for="(friend, index) in friend_list" v-if="group_user_ids.indexOf(friend.id) < 0 &
            ((friend.remark_name && friend.remark_name.startsWith(search_name)) || friend.nickname.startsWith(search_name))">
              <div class="chat-item">
                <div class="chat-img">
                  <img :src="friend.logo">
                </div>
                <div class="chat-text">
                  {{ friend.remark_name || friend.nickname}}
                  <div style="display: inline-block; position: absolute; right: 10px;">
                    <Checkbox :label="friend.id"></Checkbox>
                  </div>
                </div>

              </div>
            </template>
          </CheckboxGroup>
        </div>
    </div>
  </div>

</template>

<script>
  import {getGroupUser, getFriend, addGroupUser, checkLogin} from "../../api/index";

  export default {
    name: "GroupUserAdd",
    mounted() {
        this.group_id = this.$route.params.id;
        this.getGroupUser();
        this.getFriend();
    },
    data() {
      return {
        group_id: null,
        search_name: '',
        member_list: [],
        group_user_ids: [5],
        data_list: [],
        friend_list: []
      }
    },
    methods: {

      // 获取群组信息
      async getGroupUser() {
        let json_data = {
          group_id: this.group_id
        };
        let resp = await getGroupUser(json_data);
        if (resp.code === 200) {
          this.group_user_ids = resp.data.map(item=>item.id);
        } else {
          this.$Message.error(resp.message);
        }
      },

      // 获取好友信息
      async getFriend() {
        let resp = await getFriend();
        if (resp.code === 200) {
          this.friend_list = resp.data;
          this.data_list = resp.data;
        } else {
          this.$Message.error(resp.message);
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
          this.$router.go(-1)
        } else {
          this.$Message.error(resp.message)
        }
      },
    },
  }
</script>

<style scoped>
</style>
