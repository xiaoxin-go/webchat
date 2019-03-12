<template>
  <div>
    <input type="file" id="send-image" style="display: none;" @change="uploadImage">
    <div class="wap-main">
      <div class="wap-main-title">
        <div class="text">
          在线聊天室
          <Icon v-if="user_data.type < 2" type="md-arrow-dropdown" @click="click_chatroom_modal=!click_chatroom_modal" size="24"/>
          <div class="wap-create-group-modal" v-show="click_chatroom_modal">
            <ul>
              <li @click="create_group_modal=true">创建群组</li>
              <li @click="add_friend_active=true">添加好友</li>
            </ul>
          </div>
        </div>
        <!--<div class="more">-->
          <!--<Icon type="md-more" size="30"/>-->
        <!--</div>-->
      </div>
      <div class="wap-main-body" @click="click_chatroom_modal=false">

        <!---------------------------  聊天界面  -------------------------->
        <div class="wap-main-body-message" v-if="active==='message'">
          <template v-for="chat in chat_list">
            <div class="chat-item" @click="changeChat(chat.type + chat.chat_id, chat.name)">
              <div class="chat-img">
                <img :src="chat.logo">
              </div>
              <div class="chat-text">
                <div class="chat-text-top">
                  <span class="chat-text-name">{{chat.name}}</span>
                  <span class="chat-text-time">{{chat.update_time}}</span>
                </div>
                <div class="chat-text-message">
                  {{chat.message}}
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-----------------------   好友界面  --------------------->
        <div class="wap-main-body-friend" v-if="active==='friend'">
          <div class="wap-main-body-friend-search">
            <Input search placeholder="搜索" size="large"/>
          </div>

          <!-- 好友 -->
          <div class="wap-main-body-friend-body">
            <template v-for="(friend, index) in friend_list">
              <div class="chat-item" @click="clickFriend(index)">
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

        <!-----------------------   群聊界面  ----------------------->
        <div class="wap-main-body-friend" v-if="active==='group'">
          <div class="wap-main-body-friend-search">
            <Input search placeholder="搜索" size="large"/>
          </div>

          <!-- 群组 -->
          <div class="wap-main-body-friend-body">
            <template v-for="(group, index) in group_list">
              <div class="chat-item" @click="addChat(group)">
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

        <!------------------  个人设置页面  ---------------->
        <div class="wap-main-body-setting" v-if="active==='setting'">
          <div class="wap-main-friend-title">
        <span class="wap-main-friend-title-back" @click="active_friend=false">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
          </div>

          <div class="wap-main-friend-body">
            <div class="wap-main-friend-logo">
              <img :src="user_data.logo" alt="">
            </div>
            <div class="wap-main-friend-info">
              <p class="wap-main-friend-remark">{{user_data.username}}</p>
              <p class="wap-main-friend-nickname">昵称：{{user_data.nickname}}</p>
            </div>
          </div>
          <div class="wap-main-friend-bottom">
            <div class="wap-main-friend-update-remark" @click="edit_remark_modal=true">账户安全</div>
            <div class="wap-main-friend-sendmessage" @click="">清空站点聊天记录</div>
            <div class="wap-main-friend-delete"><Button long type="error" @click="Logout">退出站点</Button></div>
          </div>
        </div>
      </div>
      <div class="wap-main-bottom">
        <ul>
          <li :class="'wap-main-bottom-chat' + (active==='message'?' active':'')" @click="toMessage">
            <div>
              <Icon type="ios-chatbubbles" size="32"/>
            </div>
            <p>聊天</p>
          </li>
          <li @click="toFriend" :class="active==='friend'?'active':''" style="width: 23%;">
            <div>
              <Icon type="md-contacts" size="32"/>
            </div>
            <p>
              好友
            </p>
          </li>
          <li @click="toGroup" :class="active==='group'?'active':''" style="width: 23%;">
            <div>
              <Icon type="ios-people" size="34"/>
            </div>
            <p>
              群聊
            </p>
          </li>
          <li :class="'wap-main-bottom-my'  + (active==='setting'?' active':'')" @click="toSetting">
            <div>
              <Icon type="md-person" size="32"/>
            </div>
            <p>我</p>
          </li>
        </ul>
      </div>
    </div>

    <!--  点击添加好友，搜索好友页面  -->
    <div class="wap-add-friend" v-if="add_friend_active">
      <div class="wap-add-friend-title">
        <span class="wap-main-chat-title-back" @click="add_friend_active=false">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        <span class="wap-main-chat-title-name">
          添加朋友
        </span>
      </div>
      <div class="wap-add-friend-body">
        <div class="wap-add-friend-body-search">
          <Input search placeholder="好友名称" size="large" v-model="add_friend_search_name" @on-search="searchFriend"/>
        </div>
        <Divider style="font-size: 14px; font-weight: normal;">好友列表</Divider>
        <div class="wap-add-friend-info">
          <div v-for="friend in add_friend_list">
            <div class="wap-main-friend-body">
              <div class="wap-main-friend-logo">
                <img :src="friend.logo" alt="">
              </div>
              <div class="wap-main-friend-info">
                <p class="wap-main-friend-nickname">昵称：{{friend.nickname}}</p>
                <Button size="small" style="margin-top:12px ;" @click="addFriend(friend.id)">添加</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!--  点击创建群组，创建群组模态框  -->
    <Modal
      v-model="create_group_modal"
      @on-cancel="modalCancel"
      title="创建群组"
      class-name="wap-my-modal">
      <div class="wap-my-modal-text">
        <Icon class="message-file" v-if="!new_group_logo" type="ios-add-circle-outline" size="100" @click="clickImage"/>
        <img v-if="new_group_logo" :src="new_group_logo" alt="" @click="clickImage">
        <Input placeholder="请输入群组名称" width=100 autofocus v-model="new_group_name"/>
      </div>
      <div slot="footer">
        <Button type="text" @click="modalCancel">取消</Button>
        <Button type="primary" @click="createGroup">确定</Button>
      </div>
    </Modal>

    <!--  删除好友模态框 -->
    <Modal
      v-model="del_friend_modal"
      @on-cancel="modalCancel"
      title="删除好友"
      class-name="wap-my-modal">
      <div class="wap-my-modal-text">
        <span>您确定删除好友 <span style="color: #cc99ff;">{{select_friend.remark_name}}</span> 吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" @click="modalCancel">取消</Button>
        <Button type="primary" @click="delFriend">确定</Button>
      </div>
    </Modal>

    <!--  修改备注模态框 -->
    <Modal
      v-model="edit_remark_modal"
      @on-cancel="modalCancel"
      title="删除好友"
      class-name="wap-my-modal">
      <div class="wap-my-modal-text">
        <Input placeholder="请输入备注名称" autofocus v-model="new_remark_name"/>
      </div>
      <div slot="footer">
        <Button type="text" @click="modalCancel">取消</Button>
        <Button type="primary" @click="createGroup">确定</Button>
      </div>
    </Modal>

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
      }else{
        this.getInfo();
        this.getChat();
      }
    },
    data() {
      return {
        // 公共logo
        common_logo: '',

        active: 'message',   //  显示页面，{'message': 聊天界面， 'friend': 通讯录界面, 'setting': 设置页面}
        user_data: {
          logo: '/static/images/mv1.jpg',
          nickname: 'xiaoxin',
          username: 'xiaoxin',
          type: 0
        },

        logo: '/static/images/mv1.png',    // 默认logo
        search_value: '',     // 搜索框内容
        user_info: false,
        change_nickname_modal: false,   // 修改昵称模态框
        change_password_modal: false,   // 修改密码模态框

        // 新用户昵称
        new_nickname: '',

        /*---------  修改密码属性  ---------*/
        old_password: '',
        new_password: '',
        new_password_re: '',
        click_chatroom_modal: false,      // 点击在线聊天室创建群组，添加好友框


        /* ------     群组相关属性    ------- */
        // 当前选择群组
        select_group: null,

        // 点击某个群组
        active_group: false,

        // 群组列表
        group_list: [
          {'id': 1, 'name': 'test', 'logo': '/static/images/test.jpg', 'type': 'group'},
          {'id': 2, 'name': 'test1', 'logo': '/static/images/mv1.jpg', 'type': 'group'},
          {'id': 3, 'name': 'test2', 'logo': '/static/images/mv2.png', 'type': 'group'},
          {'name': 'test3', 'logo': '/static/images/mv3.jpg', 'type': 'group'},
          {'name': 'test4', 'logo': '/static/images/mv4.jpg', 'type': 'group'},
          {'name': 'test5', 'logo': '/static/images/mv5.jpeg', 'type': 'group'},
          {'name': 'test6', 'logo': '/static/images/mv2.png', 'type': 'group'},
          {'name': 'test7', 'logo': '/static/images/mv1.jpg', 'type': 'group'},
        ],

        // 过滤列表
        group_friend_filter_list: this.friend_list,

        // 已选中好友列表
        select_friend_list: [],

        // 好友搜索
        group_add_search: '',


        /* ------     好友相关属性    ------- */
        // 当前选择好友
        friend_active: '',
        // 添加好友模态框
        add_friend_modal: false,

        del_friend_modal: false,       // 删除好友
        edit_remark_modal: false,      // 修改备注
        new_remark_name: '',            // 新备注名

        // 接受好友申请模态框
        new_friend_accept_modal: false,

        // 拒绝好友申请模态框
        new_friend_deny_modal: false,

        // 点击新朋友
        new_friend_active: false,

        // 当前选择好友
        new_friend_current: '',

        // 新朋友列表
        new_friend_list: [
          {'name': 'test1', 'logo': '/static/images/test.jpg', 'message': '交个朋友'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
          {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
        ],


        // 好友列表
        friend_list: [
          {
            'id': 1,
            'username': 'xiaoxin',
            'logo': '/static/images/mv1.jpg',
            'type': 'friend',
            'nickname': 'xiaoxin1',
            'remark_name': 'xiaoxin2'
          },
          {
            'id': 2,
            'username': 'xiaoxin1',
            'logo': '/static/images/mv2.png',
            'type': 'friend',
            'nickname': 'xiaoxin2',
            'remark_name': 'xiaoxin3'
          },
          {
            'id': 3,
            'username': 'xiaoxin2',
            'logo': '/static/images/mv3.jpg',
            'type': 'friend',
            'nickname': 'xiaoxin3',
            'remark_name': 'xiaoxin3'
          },
        ],

        active_friend: false,   // 点击某个好友
        select_friend: {},    // 当前选择好友


        /* ------     用户相关属性    ------- */
        group_add_modal: false,         // 群组添加成员模态框
        setting_active: false,          // 用户设置框

        chat_setting_show: null,       // 用户设置


        // 聊天列表
        chat_list: [
          {'id': 1, 'name': 'test', 'logo': '/static/images/admin.jpg', 'type': 'group', 'chat_id': 1},
          {'id': 2, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'type': 'friend', 'chat_id': 2},
        ],

        /*--------   创建群组属性   -------*/
        //创建群组模态框
        create_group_modal: false,
        // 创建群组名称
        new_group_name: '',
        new_group_logo: '',

        /*--------   添加好友属性   -------*/
        add_friend_active: false,
        add_friend_search_name: null,
        add_friend_list: [
          {
            'id': 1,
            'username': 'xiaoxin',
            'logo': '/static/images/mv1.jpg',
            'type': 'friend',
            'nickname': 'xiaoxin1',
            'remark_name': 'xiaoxin2'
          },
          {
            'id': 2,
            'username': 'xiaoxin1',
            'logo': '/static/images/mv2.png',
            'type': 'friend',
            'nickname': 'xiaoxin2',
            'remark_name': 'xiaoxin3'
          },
        ]


      }
    },
    methods: {
      // 跳转到好友页面
      toFriend() {
        this.$router.push('/friend')
      },

      // 跳转到群组页面
      toGroup() {

      },

      // 跳转到个人设置
      toSetting() {
        this.$router.push('/user')
      },

      // 查找好友
      async searchFriend(){
        if(!this.add_friend_search_name || !this.add_friend_search_name.trim()){
          this.$Message.warning('请输入好友名称！');
          return
        }
        let json_data = {
          username: this.add_friend_search_name
        };
        let resp = await getUser(data);
        if(resp.code === 200){
          this.add_friend_list = resp.data
        }
      },
      // 添加好友
      async addFriend(friend_id){
        let json_data = {
          friend_id: friend_id
        };
        let resp = await addFriend(data);
        if(resp.code === 200){
          this.$Message.success('好友添加成功')
        }else{
          this.$Message.warning(resp.message)
        }
      },

      // 获取群组列表
      async getGroup(){
        let resp = await getGroup();
        if(resp.code === 200){
          this.group_list = resp.data;
        }else{
          this.$Message.error(resp.message);
        }
      },

      // 获取个人信息
      async getInfo() {
        let resp = await getUserInfo();
        console.log(resp);
        if (resp.code === 200) {
          this.user_data = resp.data;
        } else {
          this.$Message.warning(resp.message)
        }
      },

      // 退出登录
      async Logout(){
        let resp = await Logout();
        console.log(resp);
        if(resp.code === 200){
          this.$Message.success('用户退出登录成功');
          this.$User.setName(null);
          this.$router.push('/login')
        }else{
          this.$Message.warning('用户退出登录异常');
        }
      },

      // 进入聊天页面
      changeChat(chat_id) {
        this.chat_active_id = chat_id;
        this.scrollAuto();
      },

      // 添加聊天

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
      // 删除好友
      delFriend(){
        this.del_friend_modal = false;
        this.$Message.success('好友删除成功！')
      },

      // 取消模态框函数
      modalCancel(){
        this.del_friend_modal = false;
        this.edit_remark_modal = false;
        this.create_group_modal = false;
        this.add_friend_active = false;
      },

      // 修改好友备注
      editRemark(){
        if (!this.new_remark_name || !this.new_remark_name.trim()){
          this.$Message.warning('备注不能为空！');
          return
        }
        this.select_friend.remark_name = this.new_remark_name;
        this.edit_remark_modal = false;
        this.$Message.success('备注修改成功')
      },

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

      // 聊天滚动条在最底部
      scrollAuto(){
        this.$nextTick(() => {
          let div = document.getElementById('chat-body');
          div.scrollTop = div.scrollHeight;
        })
      },

      // 解决输入框焦点问题
      keepLastIndex(obj){
        let range = null;
        if (window.getSelection) { //ie11 10 9 ff safari
          obj.focus(); //解决ff不获取焦点无法定位问题
          range = window.getSelection(); //创建range
          range.selectAllChildren(obj); //range 选择obj下所有子内容
          range.collapseToEnd(); //光标移至最后
        } else if (document.selection) { //ie10 9 8 7 6 5
          //var range = document.selection.createRange(); //创建选择对象
          range = document.body.createTextRange();
          range.moveToElementText(obj); //range定位到obj
          range.collapse(false); //光标移至最后
          range.select();
        }
      },

    /*------------------  socketio交互 -----------------*/
     send(data){
       console.log('send.......');
       this.$socket.emit('message', 'data')
     }

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
      getMessage(data) {
        if (data) {
          return data[data.length - 1].message
        }
      },
      getAddTime(data) {
        if (data) {
          return data[data.length - 1].add_time
        }
      }
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
