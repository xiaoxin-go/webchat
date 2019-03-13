<template>
  <div>
    <input type="file" id="send-image" style="display: none;" @change="uploadImage">
    <!--  点击创建群组，创建群组模态框  -->
      <div class="wap-group-body">
        <Icon class="message-file" v-if="!new_group_logo" type="ios-add-circle-outline" size="100" @click="clickImage"/>
        <img v-if="new_group_logo" :src="new_group_logo" alt="" @click="clickImage">
        <Input placeholder="请输入群组名称" width=100 autofocus v-model="new_group_name"/>
      </div>
      <div class="wap-group-btn">
        <Button type="text" @click="modalCancel">取消</Button>
        <Button type="primary" @click="createGroup">确定</Button>
      </div>
  </div>

</template>

<script>
  import {addFriend, addGroup, addGroupUser, getChat, getChatMessage, getFriend,
    getGroup, getGroupUser, getUser, getUserInfo, deleteChat, deleteGroup,
    deleteGroupUser, deleteUser ,delFriend, updateFriend, updateGroup,
    updateGroupUser, updateUser, uploadLogo, Logout, addChat} from '../api/index.js'
  export default {
    name: "Wap",
    mounted() {
      if(!this.$User.name){
        this.$router.push('/login')
      }
    },
    data() {
      return {
        // 公共logo
        common_logo: '',

        // 创建群组名称
        new_group_name: '',
        new_group_logo: '',
      }
    },
    methods: {
      // 创建群组
      async createGroup(){
        if(!this.new_group_name || !this.new_group_name.trim()){
          this.$Message.warning('群组名称不能为空！');
          return
        }
        if(!this.new_group_logo){
          this.$Message.warning('请选择头像！');
          return
        }
        let json_data = {
          'group_name': this.new_group_name,
          'group_logo': this.new_group_logo
        };
        let resp = await addGroup(json_data);
        if (resp.code === 200){
          this.$Message.success('群组创建成功！');
          this.create_group_modal = false;
          this.getGroup();
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
          this.common_logo = resp.data.url;        // 返回的是头像路径
        }
        if(this.create_group_modal){
          this.new_group_logo =  this.$Server + this.common_logo;
        }
      },
    },
    sockets:{
      connect: function(){
        console.log('socket connected')
      },
      message: function(){
        console.log('返回' + val)
      }
    },
    filters: {
    },
    watch:{
      // message_data(){
      //   this.$nextTick(() => {
      //     console.log('....');
      //     var container = this.$el.querySelector("chat-body");
      //     container.scrollTop = container.scrollHeight;
      // })
      // }
    }
  }
</script>

<style scoped>

</style>
