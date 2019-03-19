<template>
    <div class="wap-main">
      <input type="file" id="send-image" style="display: none;" @change="uploadImage">
      <!--  点击群聊，群聊资料页面  -->
      <div class="wap-main-group">
        <div class="wap-group-info-title">
        <span class="wap-main-chat-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
          <span class="wap-main-chat-title-name">
          聊天信息({{data_list.length}})
        </span>
        </div>
        <div class="wap-group-info">
          <div class="wap-group-info-item" v-for="user in data_list">
            <div class="wap-group-info-logo">
              <img :src="user.logo" alt="">
            </div>
            <div class="wap-group-info-name">
              {{user.nickname}}
            </div>
          </div>

          <!--  群组添加成员按钮  -->
          <template v-if="group_user.type < 2">
            <div class="wap-group-info-item" style="width: 19%;" @click="$router.push(`/group_user_add/${group.id}`)">
              <div class="wap-group-info-logo">
                <img src="../../static/images/add.jpg" alt="">
              </div>
              <div class="wap-group-info-name">
                <p>&nbsp;</p>
              </div>
            </div>

            <!--  群组删除成员  -->
            <div class="wap-group-info-item" style="width: 19%;" @click="$router.push(`/group_user_del/${group.id}`)">
              <div class="wap-group-info-logo">
                <img src="../../static/images/sub.jpg" alt="">
              </div>
              <div class="wap-group-info-name">
                <p>&nbsp;</p>
              </div>
            </div>
          </template>
        </div>
        <div class="wap-group-info-info">
          <div>
            <div class="wap-group-info-group-name" @click="group_user.type<2?edit_group_name=true:''">
              群聊名称 <span>{{group.name}}<Icon type="ios-arrow-forward" size="16"/></span>
            </div>
          </div>
          <div>
            <div class="wap-group-info-group-info" @click="group_user.type<2?edit_group_info=true:''">
              群公告 <p>{{group.info}}</p>
              <span>
              <Icon type="ios-arrow-forward" size="16"/>
            </span>
            </div>
          </div>
          <div v-if="group_user.type<2">
            <div class="wap-group-info-group-logo" @click="edit_logo_modal=true">
              更换头像 <span><Icon type="ios-arrow-forward" size="16"/></span>
            </div>
          </div>
          <div v-if="group_user.type<2">
            <div class="wap-group-info-group-name" @click="$router.push(`/group_admin/${group.id}`)">
              群管理 <span><Icon type="ios-arrow-forward" size="16"/></span>
            </div>
          </div>
        </div>
        <div class="wap-group-info-delete" @click="clickDeleteGroup('delete')" v-if="group_user.type === 0">
          删除群聊
        </div>
        <div class="wap-group-info-delete" @click="clickDeleteGroup('quit')" v-else>
          退出群聊
        </div>
      </div>


      <!-- 退出群聊，模态框 -->
      <!--  删除好友模态框 -->
      <Modal
        v-model="del_group_modal"
        @on-cancel="del_group_modal=false"
        :title="del_group_title"
        class-name="wap-my-modal">
        <div class="wap-my-modal-text">
          <span>{{del_group_message}}</span>
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
        class-name="wap-my-modal">
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
        class-name="wap-my-modal">
        <div class="wap-my-modal-text">
          <Input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" :placeholder="group.info" autofocus v-model="new_group_info"/>
        </div>
        <div slot="footer">
          <Button type="text" @click="edit_group_info=false">取消</Button>
          <Button type="primary" @click="editGroupName">确定</Button>
        </div>
      </Modal>

      <!--  修改头像模态框 -->
      <Modal
        v-model="edit_logo_modal"
        @on-cancel="edit_logo_modal=false"
        title="修改头像"
        class-name="wap-my-modal" style="text-align: center;">
        <img style="width: 200px;height: 200px;" :src="new_group_logo || group.logo" alt="" @click="clickImage">
        <div slot="footer">
          <Button type="text" @click="edit_logo_modal=false">取消</Button>
          <Button type="primary" @click="editGroupLogo">确定</Button>
        </div>
      </Modal>

    </div>

</template>

<script>
  import {getGroup, updateGroup, deleteGroup, uploadLogo, getGroupUser} from "../api";

  export default {
        name: "WapChat",
      mounted() {
        if(!this.$User.user){
          this.$router.push('/login')
        }else{
          let group_id = this.$route.params.id;
          this.getGroup(group_id);
          this.getGroupUser(group_id);
        }
      },
      data(){
        return {
          group_user:{
            id: 1,
            group_id: 1,
            user_id: 1,
            remark: 'xiaoxin',
            type: 0,
          },
          group:{
          },
          new_group_name: null,
          new_group_logo: null,
          new_group_info: null,
          edit_group_name: false,
          edit_group_info: false,
          edit_logo_modal: false,
          del_group_modal: false,
          del_group_title: null,
          del_group_message: null,
          add_user_id: null,
          data_list: [],
        }
      },
      methods:{
        // 获取群组消息
        async getGroup(group_id){
          let json_data = {
            group_id: group_id,
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
        async getGroupUser(group_id){
          let json_data = {
            group_id: group_id,
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
      },
    }
</script>

<style scoped>

</style>
