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
          <Button @click="delGroupUser" type="success" :disabled="member_list.length===0" size="small">确定</Button>
          </span>
      </div>
        <div class="wap-main-body-friend-search">
          <Input v-model="search_name" search placeholder="搜索" size="large"/>
        </div>

        <!-- 好友 -->
        <div class="wap-main-body-friend-body">
          <CheckboxGroup v-model="member_list">
            <template v-for="(friend, index) in group_user_list" v-if="friend.remark_name.startsWith(search_name)">
              <div class="chat-item">
                <div class="chat-img">
                  <img :src="friend.logo">
                </div>
                <div class="chat-text">
                  {{ friend.remark_name }}
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
  import {getGroupUser,deleteGroupUser} from "../api";

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
        group_user_list: [
          {
          'id': 1,
          'username': 'xiaoxin',
          'logo': '/static/images/mv1.jpg',
          'type': 'friend',
          'nickname': 'xiaoxin1',
          'remark_name': 'xiaoxin1'
        },
          {
            'id': 2,
            'username': 'xiaoxin1',
            'logo': '/static/images/mv2.png',
            'type': 'friend',
            'nickname': 'xiaoxin2',
            'remark_name': 'xiaoxin2'
          },
          {
            'id': 3,
            'username': 'xiaoxin3',
            'logo': '/static/images/mv3.jpg',
            'type': 'friend',
            'nickname': 'xiaoxin3',
            'remark_name': 'xiaoxin3'
          },
          {
            'id': 4,
            'username': 'xiaoxin4',
            'logo': '/static/images/mv4.jpg',
            'type': 'friend',
            'nickname': 'xiaoxin4',
            'remark_name': 'xiaoxin4'
          },
          {
            'id': 5,
            'username': 'xiaoxin5',
            'logo': '/static/images/mv5.jpeg',
            'type': 'friend',
            'nickname': 'xiaoxin5',
            'remark_name': 'xiaoxin5'
          }
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
        if (resp.code === 200) {
          this.group_user_list = resp.data;
        } else {
          this.$Message.error(resp.message);
        }
      },


      // 添加成员
      async delGroupUser() {
        console.log(this.member_list);
        let json_data = {
          group_id: this.group_id,
          member_list: this.member_list
        };
        let resp = await deleteGroupUser(json_data);
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
