<template>
  <div style="height: 100%;">

    <!--聊天列表-->
    <div id="center">
      <div class="search">
        <Input type="text" @keyup.enter.native="search" v-model="search_value">
          <Icon type="ios-search" slot="prefix" />
        </Input>
      </div>

      <!------------------       群组列表     ----------------->
      <div class="center-body">
        <div class="center-item">
          <div class="create-group" @click="create_group_modal=true">
            <div class="create-group-img">
              <img src="/static/images/create_group.png">
            </div>
            <div class="create-group-text">
              创建群组
            </div>
          </div>
        </div>
        <div class="group-title">
          群聊列表{{group_list.length===0?'':('(' + group_list.length + ')')}}
        </div>

        <!-- 群组 -->
        <div class="group-body">
          <template v-for="(group, index) in group_list">
            <div :class="'chat-item ' + (group_active===index?'active':'')" @click="changeGroup(index)">
              <div class="chat-img">
                <img :src="group.logo">
              </div>
              <div class="chat-text">
                {{ group.name }}
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
        </div>
      <div class="right-main-body"></div>
    </div>

    <!--  创建群组模态框 -->
    <Modal
      v-model="create_group_modal"
      @on-cancel="modalCancel"
      title="创建群组"
      class-name="my-modal" width="400px">
      <div class="my-modal-input">
        <input type="text" placeholder="请输入群组名称" v-model="new_group_name">
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="createGroup">确定</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {getGroupUser, getGroup, addGroupUser, addGroup, deleteGroupUser, deleteGroup} from '../../api/index.js';

  export default {
    name: 'Home',
    data(){
      return {
        search_value: '',     // 搜索框内容

        group_add_modal: false,         // 群组添加成员模态框


        /* ------     群组相关属性    ------- */
        // 当前选择群组
        group_active: '',

        //创建群组模态框
        create_group_modal: false,

        // 创建群组名称
        new_group_name: '',

        // 群组列表
        group_list:[
          {'name': 'test', 'logo': '/static/images/test.jpg', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
          {'name': 'test1', 'logo': '/static/images/index.png', 'type': 'group'},
        ],

        // 过滤列表
        group_friend_filter_list: this.friend_list,



        // 好友搜索
        group_add_search:'',


      }
    },
    created(){
    },
    mounted(){
    },
    /*****************************************    方法区    ******************************************/
    methods:{

      // 获取群组列表
      async getGroup(){
        let resp = await getGroup();
        console.log(resp);
        if(resp.code === 200){
          this.group_list = resp.data;
        }else{
          this.$Message.error(resp.message);
        }
      },

      async getData(){
        this.group_friend_filter_list = this.friend_list;
      },

      // 删除管理员
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

      // 添加管理员
      async addAdmin(user_id){
        let json_data = {
          group_id: this.group_id,
          to_user_id: user_id,
          group_type: 1
        };
        let resp = await updateGroupUser(json_data);
        if (resp.code === 200){
          this.$router.go(-1)
        }else{
          this.$Message.error(resp.message)
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

      // 获取群组成员列表
      async getGroupUser(){
        let json_data = {
          group_id: this.group_id,
        };
        let resp = await getGroupUser(json_data);
        console.log(resp);
        if (resp.code === 200){
          this.data_list = resp.data;
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 修改群聊名称
      async editGroupName(){
        if(!this.new_group_name || !this.new_group_name.trim()){
          this.$Message.warning('群聊名不能为空！');
          return;
        }
        let json_data = {
          group_id: this.group.id,
          name: this.new_group_name
        };
        let resp = await updateGroup(json_data);
        if(resp.code === 200){
          this.group.name = this.new_group_name;
          this.edit_group_name = false;
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 修改群聊头像
      async editGroupLogo(){
        let json_data = {
          group_id: this.group.id,
          group_logo: this.new_group_logo
        };
        let resp = await updateGroup(json_data);
        if(resp.code === 200){
          this.group.logo = this.new_group_logo;
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 退出群聊
      clickDeleteGroup(type){
        if(type === 'quit'){
          this.del_group_title = '退出群聊';
          this.del_group_message = '您确定退出该群聊吗？'
        }else{
          this.del_group_title = '删除群聊';
          this.del_group_message = '您确定删除该群聊吗？'
        }
        this.del_group_modal = true;
      },

      // 删除群聊
      async delGroup(){
        let json_data = {
          group_id: this.group.id
        };
        let resp = await deleteGroup(json_data);
        if (resp.code === 200){
          this.$router.push('/group')
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 选择图片
      clickImage(){
        document.getElementById('send-image').click();
      },

      // 发送图片
      async uploadImage(){
        let input = document.getElementById('send-image');
        let file = input.files[0];
        let formData = new FormData();
        formData.append('file', file);
        let resp = await uploadLogo(formData);
        console.log(resp);
        if (resp.code === 200){
          this.new_group_logo = this.$Server + resp.data.url;        // 返回的是头像路径
        }
      },


      // 搜索群组
      search(){
        this.$Message.info(this.search_value)
      },

      // 选中群组
      changeGroup(index){
        this.group_active = index;
        this.select_chat = this.group_list[index];
        this.new_friend_active = false;
      },

      // 创建群组
      createGroup(){
        if(!this.new_group_name.trim()){this.$Message.warning('群组名不能为空'); return}
        if(this.group_list.filter(item=>this.new_group_name === item.name).length > 0){
          this.$Message.warning('群组已存在，请重新输入！');
          return
        }
        this.group_list.unshift({
          'name': this.new_group_name.trim(),
          'logo': this.logo
        });
        this.$Message.success('群组新建成功！');
        this.create_group_modal = false;
      },

      // 群组添加好友过滤
      groupAddSearch(){
        this.group_friend_filter_list =  this.friend_list.filter(item=>item.name.indexOf(this.group_add_search)>=0)
      },

      // 群组添加好友
      async groupAdd(){
        let json_data = {
          chat_name: this.select_chat.name,
          friend_list: this.select_friend_list
        };
        let resp = await groupAdd(json_data);
        if (resp.state === 1){
          this.chat_list.push(this.select_friend_list);
        }
      },


      // 点击设置和添加按钮
      changeSettingShow(){
        this.chat_setting_show = this.chat_setting_show===this.select_chat.type?null:this.select_chat.type
      },

      /*------------------         公共方法               -------------------------*/
      // 取消模态框
      modalCancel(){
        this.create_group_modal = false;
        this.change_password_modal = false;
        this.change_nickname_modal = false;
        this.group_add_modal = false;

        this.new_group_name = '';
      },


    },
  }
</script>

<style>

</style>
