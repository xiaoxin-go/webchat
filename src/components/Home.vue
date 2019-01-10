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
          <span>{{select_chat_name}}</span>
          <div class="right-title-settings">
            <div v-if="select_chat_type==='group'" class="right-title-setting" @click="group_add_modal=true">
              <Icon type="md-add" />
            </div>
            <div v-if="select_chat_name" class="right-title-setting" @click="setting_active=!setting_active">
              <Icon type="md-cog" />
            </div>
          </div>
        </div>
        <div class="right-body">
          <template v-for="message in message_data[select_chat_name]">
            <template v-if="message.name === nickname">
              <div class="message-item-self">
                <span style="display: inline-block;">
                  <div class="chat-text" v-html="message.message">
                    <!--{{ message.message }}-->
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
                <div class="chat-text" v-html="message.message">
                  <!--{{ message.message }}-->
                </div>
              </div>
            </template>

          </template>
        </div>

        <div class="right-foot">
          <!-- 表情和图片选择 -->
          <div style="text-align: left;height: 32px;line-height: 32px;padding-left: 20px;">
            <Icon class="message-file" type="ios-happy-outline" size="24" @click="emoji_active=!emoji_active"/>
            <div class="emoji" v-show="emoji_active">
              <template v-for="emoji in emoji_list">
                  <img :src="'/static/images/emoji/' + emoji.url" :alt="emoji.name" @click="clickEmoji(emoji)">
              </template>
            </div>
            <Icon class="message-file" type="md-images" size="24" @click="clickImage"/>
            <input type="file" id="send-image" style="display: none;" @change="sendImage">
          </div>
          <!-- 消息输入框 -->
          <div style="padding: 3px 0 0 20px;">
            <div contentEditable="true" id="send-message" class="send-message"  @input="changeMessage" v-html="send_message"></div>
            <!--<Edit v-model="send_message"></Edit>-->
          </div>
          <!-- 发送消息按钮 -->
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

    <!-- 添加好友模态框 -->
    <Modal
    v-model="group_add_modal"
    @on-cancel="modalCancel"
    class="group-add-modal"
    title="邀请好友">
      <!-- 当前好友列表 -->
      <div class="friend-list">
        <div class="group-add-search">
          <Input type="text" @on-change="groupAddSearch" v-model="group_add_search">
            <Icon type="ios-search" slot="prefix" />
          </Input>
        </div>
        <div v-for="friend in group_friend_filter_list" class="group-add-item" @click="selectFriend(friend)">
          <div class="chat-img">
            <img :src="friend.logo">
          </div>
          <div class="chat-text">
            {{friend.name}}
          </div>
          <div :class="'friend-list-input ' + (isSelectFriend(friend)?'select':'')">
            <Icon type="ios-checkmark" size="26"/>
          </div>
        </div>
      </div>
      <!-- 选中好友列表 -->
      <div class="select-friend-list">
        <div class="select-friend-list-title">
          {{select_friend_list.length>0?('已选择了('+ select_friend_list.length +')个好友'):'请选择需要添加的好友'}}
        </div>
        <div v-for="friend in select_friend_list" class="select-friend-item" @click="selectFriend(friend)">
          <div class="chat-img">
            <img :src="friend.logo">
          </div>
          <div class="chat-text">
            {{friend.name}}
          </div>
          <div class="friend-list-input">
            <Icon type="ios-close" size="22"/>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="groupAdd" :disabled="select_friend_list.length===0">确定</Button>
        <Button type="text" size="large" @click="modalCancel">取消</Button>
      </div>
    </Modal>

  </div>

</template>

<script>
  import {uploadLogo, updateUser, groupAdd} from '../api/index.js';
  import Edit from '../base/EditDiv.vue';

  export default {
    name: 'Home',
    components:{Edit},
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
        select_chat_type: '',           // 当前选择聊天类型，群组或者单聊
        send_message: '',               // 发送消息内容
        chat_active: null,              //
        send_image: null,               // 选择发送图片
        emoji_active: false,            // 表情包
        group_add_modal: false,         // 群组添加成员模态框
        setting_active: false,          // 用户设置框

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
          {'name': 'test', 'logo': '/static/images/index.png', 'type': 'group', },
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
        ],

        // 表情包
        emoji_list: [
          {'url': '1.gif', 'name': '#1'}, {'url': '2.gif', 'name': '#2'},
          {'url': '3.gif', 'name': '#3'}, {'url': '4.gif', 'name': '#4'},
          {'url': '5.gif', 'name': '#5'}, {'url': '6.gif', 'name': '#6'},
          {'url': '7.gif', 'name': '#7'}, {'url': '8.gif', 'name': '#8'},
          {'url': '9.gif', 'name': '#9'}, {'url': '10.gif', 'name': '#10'},
          {'url': '11.gif', 'name': '#11'}, {'url': '12.gif', 'name': '#12'},
          {'url': '13.gif', 'name': '#13'}, {'url': '14.gif', 'name': '#14'},
          {'url': '15.gif', 'name': '#15'}, {'url': '16.gif', 'name': '#16'},
          {'url': '17.gif', 'name': '#17'}, {'url': '18.gif', 'name': '#18'},
          {'url': '19.gif', 'name': '#19'}, {'url': '20.gif', 'name': '#20'},
          {'url': '21.gif', 'name': '#21'}, {'url': '22.gif', 'name': '#22'},
          {'url': '23.gif', 'name': '#23'}, {'url': '24.gif', 'name': '#24'},
          {'url': '25.gif', 'name': '#25'}, {'url': '26.gif', 'name': '#26'},
          {'url': '27.gif', 'name': '#27'}, {'url': '28.gif', 'name': '#28'},
          {'url': '29.gif', 'name': '#29'}, {'url': '30.gif', 'name': '#30'},
          {'url': '31.gif', 'name': '#31'}, {'url': '32.gif', 'name': '#32'},
          {'url': '33.gif', 'name': '#33'}, {'url': '34.gif', 'name': '#34'},
          {'url': '35.gif', 'name': '#35'}, {'url': '36.gif', 'name': '#36'},
          {'url': '37.gif', 'name': '#37'}, {'url': '38.gif', 'name': '#38'},
          {'url': '39.gif', 'name': '#39'}, {'url': '40.gif', 'name': '#40'},
          {'url': '41.gif', 'name': '#41'}, {'url': '42.gif', 'name': '#42'},
          {'url': '43.gif', 'name': '#43'}, {'url': '44.gif', 'name': '#44'},
          {'url': '45.gif', 'name': '#45'}, {'url': '46.gif', 'name': '#46'},
          {'url': '47.gif', 'name': '#47'}, {'url': '48.gif', 'name': '#48'},
          {'url': '49.gif', 'name': '#49'}, {'url': '50.gif', 'name': '#50'},
          {'url': '51.gif', 'name': '#51'}, {'url': '52.gif', 'name': '#52'},
          {'url': '53.gif', 'name': '#53'}, {'url': '54.gif', 'name': '#54'},
          {'url': '55.gif', 'name': '#55'}, {'url': '56.gif', 'name': '#56'},
          {'url': '57.gif', 'name': '#57'}, {'url': '58.gif', 'name': '#58'},
          {'url': '59.gif', 'name': '#59'}, {'url': '60.gif', 'name': '#60'},
          {'url': '61.gif', 'name': '#61'}, {'url': '62.gif', 'name': '#62'},
          {'url': '63.gif', 'name': '#63'}, {'url': '64.gif', 'name': '#64'},
          {'url': '65.gif', 'name': '#65'}, {'url': '66.gif', 'name': '#66'},
          {'url': '67.gif', 'name': '#67'}, {'url': '68.gif', 'name': '#68'},
          {'url': '69.gif', 'name': '#69'}, {'url': '70.gif', 'name': '#70'},
          {'url': '71.gif', 'name': '#71'}, {'url': '72.gif', 'name': '#72'},
          {'url': '73.gif', 'name': '#73'}, {'url': '74.gif', 'name': '#74'},
          {'url': '75.gif', 'name': '#75'}, {'url': '76.gif', 'name': '#76'},
          {'url': '77.gif', 'name': '#77'}, {'url': '78.gif', 'name': '#78'},
          {'url': '79.gif', 'name': '#79'}, {'url': '80.gif', 'name': '#80'},
          {'url': '81.gif', 'name': '#81'}, {'url': '82.gif', 'name': '#82'},
          {'url': '83.gif', 'name': '#83'}, {'url': '84.gif', 'name': '#84'},
          {'url': '85.gif', 'name': '#85'}, {'url': '86.gif', 'name': '#86'},
          {'url': '87.gif', 'name': '#87'}, {'url': '88.gif', 'name': '#88'},
          {'url': '89.gif', 'name': '#89'}, {'url': '90.gif', 'name': '#90'},
          {'url': '91.gif', 'name': '#91'}, {'url': '92.gif', 'name': '#92'},
          {'url': '93.gif', 'name': '#93'}, {'url': '94.gif', 'name': '#94'},
          {'url': '95.gif', 'name': '#95'}, {'url': '96.gif', 'name': '#96'},
          {'url': '97.gif', 'name': '#97'}, {'url': '98.gif', 'name': '#98'},
          {'url': '99.gif', 'name': '#99'}, {'url': '100.gif', 'name': '#100'},
          {'url': '101.gif', 'name': '#101'}
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

        // 已选中好友列表
        select_friend_list: [],

        // 好友搜索
        group_add_search:'',



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
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
          {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat'},
        ]
      }
    },
    created(){
      this.getData();
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

      async getData(){
        this.group_friend_filter_list = this.friend_list;
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
        this.select_chat_type = this.group_list[index].type;
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
          chat_name: this.select_chat_name,
          friend_list: this.select_friend_list
        }
        let resp = await groupAdd(json_data);
        if (resp.state === 1){
          this.chat_list.push(this.select_friend_list);
        }
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
        this.send_message = '';
        let div = document.getElementById('right-body');
        div.scrollTop = div.scrollHeight;
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
        this.select_chat_type = this.chat_list[index].type;
        this.new_friend_active = false;
      },

      // 点击表情
      clickEmoji(emoji){
        this.send_message += '<img src="'+ '/static/images/emoji/' + emoji.url +'">';
        this.emoji_active = false;
        setTimeout(()=>{
          this.keepLastIndex(document.getElementById('send-message'))
        },5)
      },

      // 输入消息
      changeMessage(e){
        let obj = e.target;
        this.send_message = obj.innerHTML;
        setTimeout(()=>{
          this.keepLastIndex(obj)
        },5)
      },

      // 判断好友是否被选中
      isSelectFriend(friend){
        let index = this.select_friend_list.indexOf(friend);
        if(index >= 0){
          return true
        }
      },

      // 点击好友添加到选中好友列表
      selectFriend(friend){
        let index = this.select_friend_list.indexOf(friend);
        if(index >=0 ){
          this.select_friend_list.splice(index,1);
        }else{
          this.select_friend_list.push(friend);
        }
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
        this.select_chat_name = this.friend_list[index].name;
        this.select_chat_type = this.friend_list[index].type;
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
        this.group_add_modal = false;

        this.new_group_name = '';
        this.new_nickname = '';
        this.old_password = '';
        this.new_password = '';
        this.new_password_re = '';
        this.new_friend_current = '';
        this.select_friend_list = [];
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
