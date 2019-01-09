<template>
  <div id="main" style="height: 100%;">
    <div id="left">
      <div class="user" @mouseleave="user_info=false">
        <img :src="logo" alt="" @click="changeLogo" @mouseover="user_info=true">
        <div class="user-text">
          {{nickname}}
        </div>
        <div class="user-info" v-if="user_info" @mouseleave="user_info=false">
          <ul>
            <li @click="change_nickname_modal=true">更改昵称</li>
            <li @click="change_password_modal=true">更改密码</li>
            <li @click="Logout">退出登录</li>
          </ul>
        </div>
      </div>

      <input type="file" id="logo_file" style="display: none;" @change="changeFile">

      <!--  菜单按钮  -->
      <ul>
        <li :class="'menu-item '+(active==='message'?'active':'')" @click="toMessage">
        <Tooltip content="消息" placement="right-start">
          <div :style="'width: ' + (active==='message'?'76px':'80px')">
            <Icon type="ios-chatbubbles" size="30"/>
          </div>
        </Tooltip>
        </li>
        <li :class="'menu-item '+(active==='chat'?'active':'')" @click="toChat">
          <Tooltip content="群聊" placement="right-start">
            <div :style="'width: ' + (active==='chat'?'76px':'80px')">
              <Icon type="md-contacts" size="30"/>
            </div>
          </Tooltip>
        </li>
        <li :class="'menu-item '+(active==='friend'?'active':'')" @click="toFriend">
          <Tooltip content="好友" placement="right-start">
            <div :style="'width: ' + (active==='friend'?'76px':'80px')">
              <Icon type="md-person" size="30"/>
            </div>
          </Tooltip>
        </li>
      </ul>
    </div>

    <!--聊天列表-->
    <div id="center">
      <div class="search">
        <Input type="text" @keyup.enter.native="search" v-model="search_value">
          <Icon type="ios-search" slot="prefix" />
        </Input>
      </div>

      <!-- 消息列表 -->
      <div v-if="active==='message'">
        <div class="chat-body">
          <template v-for="(chat, index) in chat_list">
            <div :class="'chat-item ' + (chat_active===index?'active':'')" @click="changeChat(index)">
              <div class="chat-img">
                <img :src="chat.logo">
              </div>
              <div class="chat-text">
                {{ chat.name }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <!------------------       群组列表     ----------------->
      <div v-if="active==='chat'" class="center-body">
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

        <!-- 新朋友 -->
        <div :class="'center-item ' + (new_friend_active?'active':'')">
          <div class="create-group" @click="clickNewFriend">
            <div class="create-group-img">
              <img src="/static/images/apply_list.png">
            </div>
            <div class="create-group-text">
              新朋友
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
                {{ friend.name }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!--  右侧消息框  -->
    <div id="right">
      <div v-if="new_friend_active">
        <div class="right-title">
          <p>新朋友</p>
        </div>
        <div class="right-body new-friend">
          <template v-for="new_friend in new_friend_list">
            <div class="new-friend-item">
              <div class="new-friend-body">
                <div class="chat-img">
                  <img :src="new_friend.logo">
                </div>
                <div class="new-friend-text">
                  <span>{{ new_friend.name }}</span> 新朋友
                </div>
                <div class="new-friend-button">
                  <Button type="primary" style="margin-right: 10px;" @click="clickAccept(new_friend.name)">接受</Button>
                  <Button type="warning" style="margin-right: 5px;" @click="clickDeny(new_friend.name)">拒绝</Button>
                </div>
              </div>
              <div class="new-friend-message">
                附言： {{new_friend.message}}
              </div>
            </div>
          </template>
        </div>
      </div>

      <!--    用户聊天界面    -->
      <div v-else>
        <div class="right-title">
          <p>{{select_chat_name}}</p>
        </div>
        <div class="right-body">
          <template v-for="message in message_data[select_chat_name]">
            <template v-if="message.name === nickname">
              <div class="message-item-self">
                <span style="display: inline-block;">
                  <div class="chat-text">
                    {{ message.message }}
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
                <div class="chat-text">
                  {{ message.message }}
                </div>
              </div>
            </template>

          </template>
        </div>
        <div class="right-foot">
          <div style="text-align: left;height: 32px;line-height: 32px;padding-left: 20px;">
            <Icon class="message-file" type="ios-happy-outline" size="24"/>
            <Icon class="message-file" type="ios-folder-outline" size="24" @click="clickImage"/>
            <input type="file" id="send-image" style="display: none;" @change="sendImage">
          </div>
          <div style="padding: 3px 0 0 20px;">
            <textarea autofocus class="send-message" v-model="send_message" style="" @keyup.enter.native="sendMessage"></textarea>
          </div>

          <div class="send-button">
            <Button @click="sendMessage" type="primary">发送</Button>
          </div>

        </div>
      </div>

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

    <!--  修改用户昵称模态框  -->
    <Modal
      v-model="change_nickname_modal"
      @on-cancel="modalCancel"
      title="修改昵称"
      class-name="my-modal" width="400px">
      <div class="my-modal-input">
        <input type="text" placeholder="请输入新昵称" v-model="new_nickname">
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="changeNickname">确定</Button>
      </div>
    </Modal>

    <!--  修改用户密码模态框 -->
    <Modal
      v-model="change_password_modal"
      @on-cancel="modalCancel"
      title="创建群组"
      class-name="my-modal" width="400px">
      <div class="my-modal-input">
        <input type="text" placeholder="请输入旧密码" v-model="old_password">
        <input type="text" placeholder="请输入新密码" v-model="new_password">
        <input type="text" placeholder="重复输入新密码" v-model="new_password_re">
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="changePassword">确定</Button>
      </div>
    </Modal>

    <!-- 接受好友申请 -->
    <Modal
      v-model="new_friend_accept_modal"
      @on-cancel="modalCancel"
      title="接受好友申请"
      class-name="my-modal" width="400px">
      <div class="my-modal-text">
        <span>您确定拒绝 <span style="color: #cc99ff;">{{new_friend_current}}</span> 吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="acceptFriend">确定</Button>
      </div>
    </Modal>

    <!-- 拒绝好友申请 -->
    <Modal
      v-model="new_friend_deny_modal"
      @on-cancel="modalCancel"
      title="拒绝好友申请"
      class-name="my-modal" width="400px">
      <div class="my-modal-text">
        <span>您确定拒绝 <span style="color: #cc99ff;">{{new_friend_current}}</span> 吗？</span>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="denyFriend">确定</Button>
      </div>
    </Modal>

  </div>

</template>

<script>
  import {uploadLogo, updateUser} from '../api/index.js'

  export default {
    name: 'Home',
    data(){
      return {
        user_data: {},
        nickname: 'xiaoxin',

        active: 'message',    // 选中菜单
        logo: '/static/images/index.png',    // 默认logo
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

        /*--------  用户消息相关属性  --------*/
        select_chat_name: '',            // 当前选择聊天对象
        send_message: '',
        chat_active: null,
        send_image: null,               // 选择发送图片

        // 用户消息列表
        message_data:{
          test: [
            {'name': 'test', 'logo': '/static/images/index.png', 'message': 'hello'},
            {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'message': 'hello'},
            {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello'},
            {'name': 'test3', 'logo': '/static/images/index.png', 'message': 'hello'},
          ],
          test1:[]
        },

        // 聊天列表
        chat_list:[
          {'name': 'test', 'logo': '/static/images/index.png'},
        ],

        /* ------     群组相关属性    ------- */
        // 当前选择群组
        group_active: '',

        //创建群组模态框
        create_group_modal: false,

        // 创建群组名称
        new_group_name: '',

        // 群组列表
        group_list:[
          {'name': 'test', 'logo': '/static/images/test.jpg'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
          {'name': 'test1', 'logo': '/static/images/index.png'},
        ],

        /*-----------   好友相关属性  -------------*/

        // 当前选择好友
        friend_active: '',
        // 添加好友模态框
        add_friend_modal: false,

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
        friend_list:[
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png'},
        ]
      }
    },
    mounted(){
      console.log(this.$User);
      if(!this.$User.name){
        this.$router.push('/login')
      }
    },
    methods:{
      /*------------        菜单相关方法           ------------------*/
      toMessage(){
        this.active = 'message';
        this.new_friend_active = false;
        this.chat_active = 0;
        this.select_chat_name = this.chat_list[0].name
      },

      toChat(){
        this.active = 'chat';
        this.new_friend_active = false;
      },

      toFriend(){
        this.active = 'friend';
        this.new_friend_active = false;
      },

      /*--------------     群组相关方法      -----------------------*/
      // 搜索群组
      search(){
        this.$Message.info(this.search_value)
      },

      // 选中群组
      changeGroup(index){
        this.group_active = index;
        this.select_chat_name = this.group_list[index].name;
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
      /*----------------           消息列表相关方法        --------------------*/
      // 发送消息
      sendMessage(){
        let data = {
          'name': 'xiaoxin',
          'logo': '/static/images/index.png',
          'message': this.send_message
        };
        this.message_data[this.select_chat_name].push(data)
      },

      // 选择图片
      clickImage(){
        document.getElementById('send-image').click();
      },

      // 发送图片
      async sendImage(){
        this.$Message.warning('......');
        let input = document.getElementById('send-image');
        let file = input.files[0];
        console.log(file.type);
        return;
        let formData = new FormData();
        formData.append('file', file);
        let resp = await uploadLogo(formData);
        console.log(resp);
        if (resp.state === 1){
          this.logo = resp.logo;        // 返回的是头像路径
        }
      },

      // 选中消息
      changeChat(index){
        this.chat_active = index;
        this.select_chat_name = this.chat_list[index].name;
        this.new_friend_active = false;
      },



      /*------------------         好友列表相关方法        ----------------------*/
      // 点击新朋友按钮
      clickNewFriend(){
        this.friend_active = null;
        this.new_friend_active = true;
      },

      // 点击好友头像
      changeFriend(index){
        this.new_friend_active = false;
        this.friend_active = index;
        this.select_chat_name = this.friend_list[index].name
      },

      // 添加好友
      addFriend(){

      },

      // 点击接受按钮
      clickAccept(name){
        this.new_friend_current = name;
        this.new_friend_accept_modal = true;
      },

      // 点击拒绝按钮
      clickDeny(name){
        this.new_friend_current = name;
        this.new_friend_deny_modal = true;
      },

      // 接受好友申请
      async acceptFriend(){

      },

      // 拒绝好友申请
      async denyFriend(){

      },


      /*------------------         公共方法               -------------------------*/
      // 取消模态框
      modalCancel(){
        this.create_group_modal = false;
        this.change_password_modal = false;
        this.change_nickname_modal = false;
        this.new_friend_accept_modal = false;
        this.new_friend_deny_modal = false;

        this.new_group_name = '';
        this.new_nickname = '';
        this.old_password = '';
        this.new_password = '';
        this.new_password_re = '';
        this.new_friend_current = '';
      },

      /*------------------         用户相关方法        ----------------------*/
      // 退出登录
      Logout(){
        this.$User.setName(null);
        this.$router.push('/login')
      },

      // 更换头像
      changeLogo(){
        document.getElementById('logo_file').click();
      },

      // 选择头像，更换头像
      async changeFile(){
        this.$Message.warning('......');
        let input = document.getElementById('logo_file');
        let file = input.files[0];
        console.log(file);
        return;
        let formData = new FormData();
        formData.append('file', file);
        let resp = await uploadLogo(formData);
        console.log(resp);
        if (resp.state === 1){
          this.logo = resp.logo;        // 返回的是头像路径
        }
      },

      // 修改用户昵称
      async changeNickname(){
        let nickname = this.new_nickname.trim();
        if(!nickname){this.$Message.warning('用户昵称不能为空'); return}

        let json_data = {
          username: this.user_data.username,
          nickname: nickname
        };
        this.nickname = nickname;
        this.change_nickname_modal = false;
        return

        let resp = await updateUser(json_data);
        if(resp.state === 1){
          this.nickname = nickname
          this.$Message.success('昵称修改成功！')

        }else{
          this.$Message.error('昵称修改失败')
        }

        this.change_nickname_modal = false;

      },

      // 修改用户密码
      async changePassword(){
        let old_password = this.old_password.trim();
        let new_password = this.new_password.trim();
        let new_password_re = this.new_password_re.trim();

        if(!old_password){this.$Message.warning('原密码不能为空');return}
        if(!new_password){this.$Message.warning('新密码不能为空');return}
        if(!new_password_re){this.$Message.warning('请重复新密码');return}

        if(new_password !== new_password_re){this.$Message.warning('新密码输入不一致'); return}

        let json_data = {
          username: this.user_data.username,
          new_password: new_password
        }

        let resp = await updateUser(json_data);
        if (resp.state === 1){
          this.$Message.success('密码修改成功！')
        }else{
          this.$Message.error('密码修改失败')
        }
        this.change_password_modal = false;

      }



    }
  }
</script>

<style>

</style>
