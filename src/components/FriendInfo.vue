<template>
    <div class="wap-main">
      <!--  点击好友，好友资料页面 -->
      <div class="wap-main-friend">
        <div class="wap-main-friend-title">
        <span class="wap-main-friend-title-back" @click="$router.go(-1)">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        </div>

        <div class="wap-main-friend-body">
          <div class="wap-main-friend-logo">
            <img :src="friend.logo" alt="">
          </div>
          <div class="wap-main-friend-info">
            <p class="wap-main-friend-remark">{{friend.remark_name}}</p>
            <p class="wap-main-friend-nickname">昵称：{{friend.nickname}}</p>
          </div>
        </div>
        <div class="wap-main-friend-bottom">
          <div class="wap-main-friend-update-remark" @click="edit_remark_modal=true">修改备注</div>
          <div class="wap-main-friend-sendmessage" @click="changeChat(friend)">发消息</div>
          <div class="wap-main-friend-delete"><Button long type="error" @click="del_friend_modal=true">删除好友</Button></div>
        </div>
      </div>

      <!--  删除好友模态框 -->
      <Modal
        v-model="del_friend_modal"
        @on-cancel="del_friend_modal=false"
        title="删除好友"
        class-name="wap-my-modal">
        <div class="wap-my-modal-text">
          <span>您确定删除好友 <span style="color: #cc99ff;">{{friend.remark_name}}</span> 吗？</span>
        </div>
        <div slot="footer">
          <Button type="text" @click="del_friend_modal=false">取消</Button>
          <Button type="primary" @click="delFriend">确定</Button>
        </div>
      </Modal>

      <!--  修改备注模态框 -->
      <Modal
        v-model="edit_remark_modal"
        @on-cancel="edit_remark_modal=false"
        title="修改备注"
        class-name="wap-my-modal">
        <div class="wap-my-modal-text">
          <Input placeholder="请输入备注名称" autofocus v-model="new_remark_name"/>
        </div>
        <div slot="footer">
          <Button type="text" @click="edit_remark_modal=false">取消</Button>
          <Button type="primary" @click="editRemark">确定</Button>
        </div>
      </Modal>

    </div>

</template>

<script>
   import {updateFriend, deleteFriend} from "../api";

   export default {
        name: "FriendInfo",
      mounted() {
        if(!this.$User.user){
          this.$router.push('/login')
        }else{
          this.friend = this.$route.params.friend
        }
      },
      created(){

      },
      computed:{
        // friend_info(){
        //   console.log(this.$router.params.friend);
        //   return this.$route.params.friend
        // }
      },
      data(){
        return {
          friend:{},
          del_friend_modal: null,
          edit_remark_modal: null,
          new_remark_name: null,
        }
      },
      methods:{
        // 更新好友资料
        async editRemark(){
          if(!this.new_remark_name || !this.new_remark_name.trim()){
            this.$Message.warning('备注名不能为空！');
            return
          }
          let json_data = {
            friend_id: this.friend.id,
            remark: this.new_remark_name
          };
          let resp = await updateFriend(json_data);
          if(resp.code === 200){
            friend.remark_name = this.remark_name;
            this.edit_remark_modal = false;
          }else{
            this.$Message.warning(resp.message);
          }
        },

        // 删除好友
        async delFriend(){
          let json_data = {
            friend_id: this.friend.id
          };
          let resp = await deleteFriend(json_data);
          if (resp.state === 200){
            this.$Message.success('好友删除成功');
            this.$router.push('/friend');
          }else{
            this.$Message.error(resp.message)
          }
        },

        // 进入聊天页面
        changeChat(friend) {
          this.$router.push({
            name: 'Chat',
            params:{
              chat: friend
            }
          })
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
  /*  好友资料页面样式 */
  .wap-main-friend-body{
    background:#ffffff;
    padding-top: 10px;
    text-align: left;
    padding-bottom: 30px;
  }

  .wap-main-friend-logo>img{
    height: 60px;
    width: 60px;
    border-radius: 3px;
  }
  .wap-main-friend-logo{
    margin: 0 15px;
  }
  .wap-main-friend-info, .wap-main-friend-logo{
    display:inline-block;
    vertical-align: top;
  }
  .wap-main-friend-remark{
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }
  .wap-main-friend-nickname{
    color: #888888;
    margin-top: 5px;
  }
  .wap-main-friend-bottom{
    background: #ffffff;
    margin-top: 20px;
  }
  .wap-main-friend-bottom>div{
    height: 40px;
    line-height: 40px;
  }
  .wap-main-friend-update-remark,.wap-main-friend-sendmessage{
    border-bottom: 1px solid #eeeeee;
    width: 98%;
    margin: auto;
  }
  .wap-main-friend-delete{
    margin: 0 2px;
  }
  .wap-my-modal{
    width: 300px!important;
    margin: auto;
  }
  .wap-my-modal-text{
    padding: 0 20px;
    text-align: center;
  }
  .wap-my-modal-text>img{
    width: 100px;
    height: 100px;
  }
  .wap-add-friend-title{
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-weight: bold;
  }
  .ivu-divider-inner-text{
    color: #666;
  }
  .wap-add-friend-info .wap-main-friend-body{
    padding-bottom: 0;
  }
</style>
