<template>
  <div class="settings-show">
    <input type="file" id="send-image" style="display: none;" @change="uploadImage">
    <div class="settings-chat">
      <img :src="group.logo" alt="" @click="clickImage" class="pc-group-logo">
      <p style="font-size: 20px;">{{group.name}}</p>
    </div>
    <div class="chat-group-info" style="border-bottom: 1px solid #ccc; padding-bottom: 5px;">
      <p style="text-align: left; font-size: 20px; padding: 5px;">公告</p>
      <p style="font-size: 14px;color: #aaaaaa; padding: 0 5px; text-align:justify">{{group.info}}</p>
    </div>
    <div class="settings-chat-item" @click="edit_group_name=true">
      <span>修改群名</span><span class="settings-chat-item-icon"><Icon type="ios-arrow-forward" size="22"/></span>
    </div>
    <div class="settings-chat-item" @click="edit_group_info=true">
      <span>修改公告</span><span class="settings-chat-item-icon"><Icon type="ios-arrow-forward" size="22"/></span>
    </div>
    <div class="settings-chat-item" @click="del_group_modal=true">
      退出群聊
    </div>
    <!-- 退出群聊，模态框 -->
    <Modal
      v-model="del_group_modal"
      @on-cancel="del_group_modal=false"
      title="退出群聊"
      width="400px">
      <div class="wap-my-modal-text">
        <span>您确定群组当前群聊吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" @click="del_group_modal=false">取消</Button>
        <Button type="primary" @click="delGroup">确定</Button>
      </div>
    </Modal>
    <!--  修改群名模态框 -->
    <Modal
      v-model="edit_group_name"
      @on-cancel="edit_group_name=false"
      title="修改群聊名称"
      width="400px">
      <div class="wap-my-modal-text">
        <Input placeholder="请输入群聊名称" autofocus v-model="new_group_name"/>
      </div>
      <div slot="footer">
        <Button type="text" @click="edit_group_name=false">取消</Button>
        <Button type="primary" @click="editGroupName">确定</Button>
      </div>
    </Modal>
    <!--  修改公告模态框 -->
    <Modal
      v-model="edit_group_info"
      @on-cancel="edit_group_info=false"
      title="修改群公告"
      width="400px">
      <div class="wap-my-modal-text">
        <Input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" :placeholder="group.info" autofocus v-model="new_group_info"/>
      </div>
      <div slot="footer">
        <Button type="text" @click="edit_group_info=false">取消</Button>
        <Button type="primary" @click="editGroupInfo">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    addGroupUser,
    deleteFriend,
    deleteGroupUser,
    getGroup,
    getGroupUser,
    quitGroup,
    updateGroup,
    uploadLogo
  } from "../../api";

    export default {
        name: "FriendInfo",
        data(){
          return{
            group: {
              name: '测试群',
              logo: '/static/images/mv2.png',
              id: 1,
              info: '这是一个测试群,这是一个测试群这是一个测试群这是一个测试群这是一个测试群这是一个测试群'
            },
            group_user_type: null,
            search_name: '',
            edit_remark_modal: false,
            new_group_name: null,
            edit_group_name: false,
            new_group_logo: null,
            new_group_info: null,
            edit_group_info: false,
            del_group_modal: false,
            data_list: [
              {id: 1, 'username': 'xiaoxin', 'logo': '/static/images/mv1.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 2, 'username': 'xiaoxin1', 'logo': '/static/images/mv2.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 3, 'username': 'xiaoxin2', 'logo': '/static/images/mv3.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 4, 'username': 'xiaoxin3', 'logo': '/static/images/mv4.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 5, 'username': 'xiaoxin4', 'logo': '/static/images/mv5.jpeg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 6, 'username': 'xiaoxin', 'logo': '/static/images/mv1.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 7, 'username': 'xiaoxin1', 'logo': '/static/images/mv2.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 8, 'username': 'xiaoxin2', 'logo': '/static/images/mv3.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 9, 'username': 'xiaoxin3', 'logo': '/static/images/mv4.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 10, 'username': 'xiaoxin4', 'logo': '/static/images/mv5.jpeg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 11, 'username': 'xiaoxin', 'logo': '/static/images/mv1.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 12, 'username': 'xiaoxin1', 'logo': '/static/images/mv2.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 13, 'username': 'xiaoxin2', 'logo': '/static/images/mv3.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 14, 'username': 'xiaoxin3', 'logo': '/static/images/mv4.jpg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {id: 15, 'username': 'xiaoxin4', 'logo': '/static/images/mv5.jpeg', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
            ],
          }
        },
      mounted() {
        //this.getGroup();
      },
      props:['group_id'],
      methods:{
        // 获取群组信息
        async getGroup(){
          let json_data = {
            group_id: this.group_id,
          };
          let resp = await getGroup(json_data);
          console.log(resp);
          if(resp.code === 200){
            this.group = resp.data
          }else{
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
            this.data_list = resp.data.data_list;
            this.group_user_type = resp.data.group_type;
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
            group_id: this.group_id,
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
        // 修改群聊公告
        async editGroupInfo(){
          let json_data = {
            group_id: this.group_id,
            info: this.new_group_info
          };
          let resp = await updateGroup(json_data);
          if(resp.code === 200){
            this.group.info = this.new_group_info;
            this.edit_group_info = false;
          }else{
            this.$Message.error(resp.message);
          }
        },

        // 修改群聊头像
        async editGroupLogo(){
          let json_data = {
            group_id: this.group_id,
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
        async quitGroup(){
          let json_data = {
            group_id: this.group_id
          };
          let resp = await quitGroup(json_data);
          if(resp.code === 200){
            this.$Message.success('群聊退出成功');
            this.$router.push('/pc/chat');
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
            this.editGroupLogo();
          }
        },
      }
    }
</script>

<style scoped>

</style>
