<template>
  <div style="height: 100%;">

    <!--聊天列表-->
    <div id="center">
      <div class="search">
        <Input type="text" @keyup.enter.native="search" v-model="search_value">
          <Icon type="ios-search" slot="prefix" />
        </Input>
      </div>

      <!------------------       好友列表     ----------------->
      <div v-if="active==='friend'" class="center-body">
        <div class="center-item">
          <div class="create-group" @click="add_friend_modal=true">
            <div class="create-group-img">
              <img src="/static/images/search_add_friend.png">
            </div>
            <div class="create-group-text">
              搜索添加好友
            </div>
          </div>
        </div>

        <div class="chat-title">
          好友列表{{friend_list.length===0?'':(' (' + friend_list.length + '人)')}}
        </div>

        <!-- 好友 -->
        <div class="friend-body">
          <template v-for="(friend, index) in friend_list">
            <div :class="'chat-item ' + (friend_active===index?'active':'')" @click="changeFriend(index)">
              <div class="chat-img">
                <img :src="friend.logo">
              </div>
              <div class="chat-text">
                {{ friend.remark_name }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    右侧消息框
    <div id="right">
      <!--    用户聊天界面    -->
        <div class="right-title">
          <span>{{select_chat.remark_name}}</span>
          <div class="right-title-settings">
            <div v-if="select_chat.type==='group'" class="right-title-setting" @click="group_add_modal=true">
              <Icon type="md-add" />
            </div>
            <div v-if="select_chat.username" class="right-title-setting" @click="changeSettingShow">
              <Icon type="md-cog" />
            </div>
          </div>
        </div>
        <div>
          <div :class="chat_setting_show?'right-main-show':'right-main'">
            <div class="right-body">
              <template v-for="message in message_data[select_chat.name]">
                <template v-if="message.name === nickname">
                  <div class="message-item-self">
                <span style="display: inline-block;">
                  <div class="chat-text" v-html="message.message">
                    <!--{{ message.message }}-->
                  </div>
                  <div class="chat-img">
                    <img :src="message.logo">
                  </div>
                </span>
                  </div>

                </template>
                <template v-else>
                  <div class="message-item">
                    <div class="chat-img">
                      <img :src="message.logo">
                    </div>
                    <div class="chat-text" v-html="message.message">
                      <!--{{ message.message }}-->
                    </div>
                  </div>
                </template>

              </template>
            </div>
          </div>
      </div>

    </div>


    <!-- 添加好友模态框 -->
    <Modal
      v-model="group_add_modal"
      @on-cancel="modalCancel"
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
        <Button type="text" size="large" @click="modalCancel">取消</Button>
      </div>
    </Modal>

    <!--  删除好友模态框 -->
    <Modal
      v-model="del_friend_modal"
      @on-cancel="modalCancel"
      title="删除好友"
      class-name="my-modal" width="400px">
      <div class="my-modal-text">
        <span>您确定删除好友 <span style="color: #cc99ff;">{{select_chat.name}}</span> 吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="delFriend">确定</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {getFriend, updateFriend, deleteFriend} from '../../api/index.js';
  import Edit from '../../base/EditDiv.vue';
  import {deleteChat} from "../../api/index";

  export default {
    name: 'Home',
    components:{Edit},
    data(){
      return {
        search_value: '',     // 搜索框内容

        // 好友搜索
        group_add_search:'',



        /*-----------   好友相关属性  -------------*/

        // 当前选择好友
        friend_active: '',
        // 添加好友模态框
        add_friend_modal: false,

        // 好友列表
        friend_list:[
          {'username': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin1', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin2', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin3', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin4', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin5', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin6', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin7', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin8', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin9', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin10', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
          {'username': 'xiaoxin11', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
        ]
      }
    },
    created(){
      this.getData();
    },
    mounted(){
    },
    /*****************************************    方法区    ******************************************/
    methods:{

      // 点击好友头像
      changeFriend(index){
        this.new_friend_active = false;
        this.friend_active = index;
        this.select_chat = this.friend_list[index]
      },

    },
  }
</script>

<style>

</style>
