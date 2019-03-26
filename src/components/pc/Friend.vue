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
      <div class="center-body">
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

    <!--右侧消息框-->
    <div id="right">
      <!--    用户聊天界面    -->
        <div class="right-title">
          <span>{{select_friend.remark_name}}</span>
        </div>
        <div class="right-main-body"></div>
      </div>

    <!--  删除好友模态框 -->
    <Modal
      v-model="del_friend_modal"
      @on-cancel="del_friend_modal=false"
      title="删除好友"
      class-name="my-modal" width="400px">
      <div class="my-modal-text">
        <span>您确定删除好友 <span style="color: #cc99ff;">{{select_friend.name}}</span> 吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="del_friend_modal=false">取消</Button>
        <Button type="primary" size="large" @click="delFriend">确定</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {getFriend, updateFriend, deleteFriend} from '../../api/index.js';
  import Edit from '../../base/EditDiv.vue';
  import {deleteChat} from "../../api/index";
  import {addFriend, getUser, getUserInfo, updateUser} from "../../api";

  export default {
    name: 'Home',
    components:{Edit},
    data(){
      return {
        search_value: '',     // 搜索框内容
        select_friend:{},
        // 好友搜索
        group_add_search:'',

        /*-----------   好友相关属性  -------------*/
        // 当前选择好友
        friend_active: '',
        // 添加好友模态框
        add_friend_modal: false,
        del_friend_modal: false,

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

    },
    mounted(){
    },
    /*****************************************    方法区    ******************************************/
    methods:{
      // 获取好友列表
      async getFriend(){
        let resp = await getFriend();
        if(resp.code === 200){
          this.friend_list = resp.data;
        }else{
          this.$Message.error(resp.message)
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

      // 点击好友头像
      changeFriend(index){
        this.new_friend_active = false;
        this.friend_active = index;
        this.select_friend = this.friend_list[index]
      },

      async searchFriend(){
        if(!this.search_name || !this.search_name.trim()){
          this.$Message.warning('请输入好友名称！');
          return
        }
        let json_data = {
          username: this.search_name
        };
        let resp = await getUser(json_data);
        if(resp.code === 200){
          console.log(resp.data);
          this.friend = resp.data
        }
      },
      // 添加好友
      async addFriend(){
        let json_data = {
          friend_id: this.friend.id
        };
        let resp = await addFriend(json_data);
        if(resp.code === 200){
          this.$Message.success('好友添加成功')
        }else{
          this.$Message.warning(resp.message)
        }
      },

    },
  }
</script>

<style>

</style>
