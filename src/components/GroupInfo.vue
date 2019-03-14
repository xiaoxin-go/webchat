<template>
    <div class="wap-main">
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
              {{user.name}}
            </div>
          </div>
          <template v-if="group_user.type < 2">
            <div class="wap-group-info-item" style="width: 19%;" @click="addGroupUser">
              <div class="wap-group-info-logo">
                <img src="../../static/images/add.jpg" alt="">
              </div>
              <div class="wap-group-info-name">
                <p>&nbsp;</p>
              </div>
            </div>
            <div class="wap-group-info-item" style="width: 19%;" @click="delGroupUser">
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
            <div class="wap-group-info-group-name" @click="edit_group_modal">
              群聊名称 <span>{{group.name}}<Icon type="ios-arrow-forward" size="16"/></span>
            </div>
          </div>
          <div>
            <div class="wap-group-info-group-info">
              群公告 <p>{{group.info}}</p>
              <span>
              <Icon type="ios-arrow-forward" size="16"/>
            </span>
            </div>
          </div>
          <div>
            <div class="wap-group-info-group-name" @click="">
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
  import {getGroup, updateGroup, deleteGroup} from "../api";

  export default {
        name: "WapChat",
      mounted() {
        if(!this.$User.user){
          this.$router.push('/login')
        }else{
          let group_id = this.$route.params.id;
          this.getGroup(group_id)
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
            id: 1,
            type: 'group',
            name: 'mv1',
            logo: '/static/images/mv1.jpg',
            info: '这是一个测试页面,这是一个测试页面,这是一个测试页面,这是一个测试页面,这是一个测试页面,这是一个测试页面,'
          },
          new_group_name: null,
          new_group_logo: null,
          edit_group_modal: false,
          del_group_modal: false,
          del_group_title: null,
          del_group_message: null,
          add_user_id: null,
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
        // 获取群组消息
        async getGroup(group_id){
          let json_data = {
            group_id: group_id,
          };
          let resp = await getGroup(json_data);
          if(resp.code === 200){
            this.group = resp.data
          }else{
            this.$Message.error(resp.message)
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

        // 修改群聊头像
        async editGroupLogo(){
          if(!this.new_group_name || !this.new_group_name.trim()){
            this.$Message.warning('群聊名不能为空！');
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
            group_id: group.id
          };
          let resp = await deleteGroup(json_data);
          if (resp.code === 200){
            this.$router.push('/group')
          }else{
            this.$Message.error(resp.message);
          }
        },

        // 添加成员
        async addGroupUser(){
          let json_data = {
            group_id: this.group.id,
            user_id: this.add_user_id
          };
          let resp = await addGroupUser(json_data);
          if(resp.coce === 200){
            this.$Message.success(resp.message)
          }else{
            this.$Message.error(resp.message)
          }
        },

        // 删除成员
        delGroupUser(){

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
  /*   群组详情样式  */
  .wap-group-info-title{
    text-align: left;
    height: 40px;
    line-height: 40px;
  }
  .wap-group-info{
    background: #fff;
    padding: 5px;
    text-align: left;
  }

  .wap-group-info-item{
    display: inline-block;
    width: 20%;
    padding: 8px;
    text-align: center;
  }
  .wap-group-info-logo{

  }
  .wap-group-info-logo>img{
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  .wap-group-info-name{
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }
  .wap-group-info-info{
    background: #fff;
    margin: 8px 0;
    border-top: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
    text-align: left;
    font-size: 14px;
  }
  .wap-group-info-info>div{
    padding-left: 10px;
  }
  .wap-group-info-info>div:active, .wap-group-info-delete:active{
    background:#dedede;
  }
  .wap-group-info-group-name, .wap-group-info-delete{
    height: 46px;
    line-height: 46px;
    padding-left: 1px;
  }
  .wap-group-info-group-name>span{
    float: right;
    margin-right: 8px;
    color: #898989;
  }
  .wap-group-info-group-info{
    display: inline-block;
    padding-top: 6px;
    position: relative;
    border-bottom: 1px solid #dedede;
    border-top: 1px solid #dedede;
    padding-left: 1px;
  }
  .wap-group-info-group-info>p{
    padding: 5px 0 5px 10px;
    color: #898989;
    font-size: 12px;
    width: 84%;
    text-align:justify
  }
  .wap-group-info-group-info>span{
    position: absolute;
    right: 10px;
    color: #898989;
    top: 50%;
    margin: -8px 0 0 0;
  }
  .wap-group-info-delete{
    background: #fff;
    border-top: 1px solid #dedede;
    color: orangered;
    font-size: 14px;
    font-weight: bold;
  }
</style>
