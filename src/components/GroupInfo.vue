<template>
    <div class="wap-main">
      <!--  点击群组，群组资料页面  -->
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
              {{user.name}}
            </div>
          </div>
        </div>
      </div>

      <!-- 退出群组，模态框 -->
      <!--  删除好友模态框 -->
      <Modal
        v-model="del_group_modal"
        @on-cancel="del_group_modal=false"
        title="删除好友"
        class-name="wap-my-modal">
        <div class="wap-my-modal-text">
          <span>您确定删除好友 <span style="color: #cc99ff;">{{group.remark_name}}</span> 吗？</span>
        </div>
        <div slot="footer">
          <Button type="text" @click="del_group_modal=false">取消</Button>
          <Button type="primary" @click="delGroup">确定</Button>
        </div>
      </Modal>

      <!--  修改备注模态框 -->
      <Modal
        v-model="edit_group_modal"
        @on-cancel="edit_group_modal=false"
        title="修改备注"
        class-name="wap-my-modal">
        <div class="wap-my-modal-text">
          <Input placeholder="请输入备注名称" autofocus v-model="new_group_name"/>
        </div>
        <div slot="footer">
          <Button type="text" @click="edit_group_modal=false">取消</Button>
          <Button type="primary" @click="editGroupName">确定</Button>
        </div>
      </Modal>

    </div>

</template>

<script>
  import {updateGroup, deleteGroup} from "../api";

  export default {
        name: "WapChat",
      mounted() {
        if(!this.$User.user){
          this.$router.push('/login')
        }else{

        }
      },
      data(){
        return {
          group:{
            id: 1,
            type: 'group',
            name: 'mv1',
            logo: '/static/images/mv1.jpg'
          },
          new_group_name: null,
          new_group_logo: null,
          edit_group_modal: false,
          del_group_modal: false,
          data_list: [
            {'id': 1, 'name': 'testfdsafdsfsf', 'logo': '/static/images/test.jpg', 'type': 'group'},
            {'id': 2, 'name': 'test1', 'logo': '/static/images/mv1.jpg', 'type': 'group'},
            {'id': 3, 'name': 'test2', 'logo': '/static/images/mv2.png', 'type': 'group'},
            {'name': 'test3', 'logo': '/static/images/mv3.jpg', 'type': 'group'},
            {'name': 'test4', 'logo': '/static/images/mv4.jpg', 'type': 'group'},
            {'name': 'test5', 'logo': '/static/images/mv5.jpeg', 'type': 'group'},
            {'name': 'test6', 'logo': '/static/images/mv2.png', 'type': 'group'},
            {'name': 'test7', 'logo': '/static/images/mv1.jpg', 'type': 'group'},
          ],
        }
      },
      methods:{
        // 修改群组名称
        async editGroupName(){
          if(!this.new_group_name || !this.new_group_name.trim()){
            this.$Message.warning('群组名不能为空！');
            return;
          }
          let json_data = {
            group_id: this.group.id,
            group_name: this.new_group_name
          };
          let resp = await updateGroup(json_data);
          if(resp.code === 200){
            this.group.name = this.new_group_name;
            this.edit_group_modal = false;
          }else{
            this.$Message.error(resp.message);
          }
        },

        // 修改群组头像
        async editGroupLogo(){
          if(!this.new_group_name || !this.new_group_name.trim()){
            this.$Message.warning('群组名不能为空！');
            return;
          }
          let json_data = {
            group_id: this.group.id,
            group_name: this.new_group_logo
          };
          let resp = await updateGroup(json_data);
          if(resp.code === 200){
            this.group.name = this.new_group_logo;
          }else{
            this.$Message.error(resp.message);
          }
        },

        // 删除群组
        async delGroup(){
          let json_data = {
            group_id: group.id
          };
          let resp = await deleteGroup(json_data);
          if (resp.code === 200){
            this.$router.push('/group')
          }else{
            this.$Message.error(resp.message);
          }
        },


        // 发送消息
        sendMessage(){
          let data = {
            'name': 'xiaoxin',
            'logo': '/static/images/xiaoxin.jpg',
            'message': this.send_message
          };
          this.message_data[this.chat_active_id].push(data);
          this.send_message = '';
          // let div = document.getElementById('chat-body');
          // div.scrollTop = div.scrollHeight;
          this.scrollAuto();
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
    }
</script>

<style scoped>

</style>
