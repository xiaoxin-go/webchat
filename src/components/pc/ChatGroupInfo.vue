<template>
  <div class="settings-show">
    <div class="settings-group">
      <div class="group-pople">
        <p>群成员</p>
        <div class="group-logo">
          <img src="" alt="">
        </div>
        <p>所有成员</p>
      </div>
      <div>
        群组名称
      </div>
      <div>
        禁言
      </div>
      <div>
        解散群
      </div>
    </div>

    <!-- 添加好友模态框 -->
    <Modal
      v-model="group_add_modal"
      @on-cancel="group_add_modal=false"
      class="group-add-modal"
      title="邀请好友">
      <!-- 当前好友列表 -->
      <div class="friend-list">
        <div class="group-add-search">
          <Input type="text" @on-change="groupAddSearch" v-model="group_add_search">
            <Icon type="ios-search" slot="prefix" />
          </Input>
        </div>
        <div v-for="friend in group_friend_filter_list" class="group-add-item" @click="selectFriend(friend)">
          <div class="chat-img">
            <img :src="friend.logo">
          </div>
          <div class="chat-text">
            {{friend.name}}
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
            {{friend.name}}
          </div>
          <div class="friend-list-input">
            <Icon type="ios-close" size="22"/>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="groupAdd" :disabled="select_friend_list.length===0">确定</Button>
        <Button type="text" size="large" @click="group_add_modal=false">取消</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import {deleteFriend} from "../../api";

    export default {
        name: "FriendInfo",
        data(){
          return{
            group: {},
            data_list:[],
            new_group_name: null,
            new_group_logo: null,
            new_group_info: null,
            edit_group_name: '',
            edit_group_info: '',
            edit_logo_modal: false,
            del_group_modal: false,
            del_group_title: null,
            del_group_message: null,
            add_user_id: null,
          }
        },
      mounted() {
        //this.getUserInfo();
      },
      props:['group_id'],
      methods:{

      }
    }
</script>

<style scoped>

</style>
