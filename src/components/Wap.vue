<template>
  <div>
    <div class="wap-main">
      <div class="wap-main-title">
        <div class="text" @click="click_chatroom_modal=!click_chatroom_modal">
          在线聊天室
          <Icon type="md-arrow-dropdown" size="24"/>
          <div class="wap-create-group-modal" v-show="click_chatroom_modal">
            <ul>
              <li>创建群组</li>
              <li>添加好友</li>
            </ul>
          </div>
        </div>
        <div class="more">
          <Icon type="md-more" size="30"/>
        </div>
      </div>
      <div class="wap-main-body" @click="click_chatroom_modal=false">
        <!--  聊天界面  -->
        <div class="wap-main-body-message" v-if="active==='message'">
          <template v-for="chat in chat_list">
            <div class="chat-item" @click="changeChat(chat.type + chat.chat_id, chat.name)">
              <div class="chat-img">
                <img :src="chat.logo">
              </div>
              <div class="chat-text">
                <div class="chat-text-top">
                  <span class="chat-text-name">{{chat.name}}</span>
                  <span class="chat-text-time">{{message_data[chat.type + chat.chat_id] | getAddTime}}</span>
                </div>
                <div class="chat-text-message">
                  {{message_data[chat.type + chat.chat_id] | getMessage}}
                </div>
              </div>
            </div>
          </template>
        </div>

        <!--   好友界面  -->
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

        <!--   群聊界面  -->
        <div class="wap-main-body-friend" v-if="active==='group'">
          <div class="wap-main-body-friend-search">
            <Input search placeholder="搜索" size="large"/>
          </div>

          <!-- 好友 -->
          <div class="wap-main-body-friend-body">
            <template v-for="(group, index) in group_list">
              <div class="chat-item" @click="changeChat('group' + group.id, group.name)">
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

        <!--  个人设置页面  -->
        <div class="wap-main-body-setting" v-if="active==='setting'">
          <div class="wap-main-body-setting-logo">
            <div class="wap-main-body-setting-logo-img">
              <img :src="user_data.logo" alt="">
            </div>
            <div class="wap-main-body-setting-logo-text">
              <div class="wap-main-body-setting-logo-text-name">
                {{user_data.nickname}}
              </div>
              <div class="wap-main-body-setting-logo-text-id">
                ID:{{user_data.username}}
              </div>
            </div>
          </div>
          <div class="wap-main-body-setting-body">
            <div class="wap-main-body-setting-body-item">
              <div class="wap-main-body-setting-body-item-text">
                账户安全
              </div>
              <div class="wap-main-body-setting-body-item-icon">
                <Icon type="ios-arrow-forward"/>
              </div>

            </div>
            <div class="wap-main-body-setting-body-item">
              <div class="wap-main-body-setting-body-item-text">
                清空站点聊天记录
              </div>
              <div class="wap-main-body-setting-body-item-icon">
                <Icon type="ios-arrow-forward"/>
              </div>
            </div>
          </div>
          <div class="wap-main-body-setting-logout">
            退出站点
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

    <!--  聊天页面  -->
    <div class="wap-main-chat" v-if="chat_active">
      <div class="wap-main-chat-title">
        <span class="wap-main-chat-title-back" @click="chat_active=false">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
        <span class="wap-main-chat-title-name">
          {{ chat_active_name }}
        </span>
        <span class="wap-main-chat-title-more">
          <Icon type="ios-more" size="20"/>
        </span>
      </div>
      <!--  聊天body  -->
      <div class="wap-main-chat-body" id="chat-body">
        <template v-for="message in message_data[chat_active_id]">
          <template v-if="message.name === nickname">
            <div class="message-item-self">
                  <div class="wap-chat-text">
                    <span v-html="message.message" style="text-align: left;display: inline-block;"></span>
                  </div>
                  <div class="wap-chat-img">
                    <img :src="message.logo">
                  </div>
            </div>

          </template>
          <template v-else>
            <div class="message-item">
              <div class="wap-chat-img">
                <img :src="message.logo">
              </div>
              <div class="wap-chat-text">
                <span v-html="message.message"></span>
              </div>
            </div>
          </template>

        </template>
      </div>
      <!--输入框-->
      <div class="wap-main-chat-bottom">
        <div style="text-align: left;height: 30px;line-height: 30px;padding-left: 5px; float: left;">
          <Icon class="message-file" type="ios-happy-outline" size="22" @click="emoji_active=!emoji_active"/>
          <div class="emoji" v-show="emoji_active">
            <template v-for="emoji in emoji_list">
              <img :src="'/static/images/emoji/' + emoji.url" :alt="emoji.name" @click="clickEmoji(emoji)">
            </template>
          </div>
          <Icon class="message-file" type="md-images" size="22" @click="clickImage"/>
          <input type="file" id="send-image" style="display: none;" @change="sendImage">
        </div>
        <div style="float: left;width: 68%; left: 3px;">
          <div contentEditable="true" id="send-message" class="send-message" @input="changeMessage"
               v-html="send_message"></div>
        </div>

        <Button @click="sendMessage" size="small" type="primary" style="float: left; left: 3px;">发送</Button>

      </div>
      <div class="frame-btn" @click="active_frame=true">
        <Icon type="logo-vimeo" size="20"/>
      </div>
    </div>
    <!--  第三方广告页面  -->
    <div v-if="active_frame" class="frame-div">
      <div @click="active_frame=false" style="position: absolute; color: #57a3f3;top: 20px; left: 2px;">
        <Icon type="ios-undo" size="20"/>
      </div>
      <a href="http://www.51job.com"></a>
      <!--<iframe src="http://www.youku.com" frameborder="0" style="width: 100%; height: 100%;background: #fafafa;"></iframe>-->
    </div>

    <!--  点击好友，好友资料页面 -->
    <div class="wap-main-friend" v-if="active_friend">
      <div class="wap-main-friend-title">
        <span class="wap-main-friend-title-back" @click="active_friend=false">
          <Icon type="ios-arrow-back" size="18"/>
        </span>
      </div>

      <div class="wap-main-friend-body">
          <div class="wap-main-friend-logo">
            <img :src="select_friend.logo" alt="">
          </div>
          <div class="wap-main-friend-info">
            <p class="wap-main-friend-remark">{{select_friend.remark_name}}</p>
            <p class="wap-main-friend-nickname">昵称：{{select_friend.nickname}}</p>
          </div>
      </div>
      <div class="wap-main-friend-bottom">
        <div class="wap-main-friend-update-remark" @click="edit_remark_modal=true">修改备注</div>
        <div class="wap-main-friend-sendmessage" @click="changeChat('friend' + select_friend.id, select_friend.remark_name)">发消息</div>
        <div class="wap-main-friend-delete"><Button long type="error" @click="del_friend_modal=true">删除好友</Button></div>
      </div>
    </div>

    <!--  点击群组，群组资料页面  -->
    <div class="wap-main-group" v-if="active_group">

    </div>

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
    <!-- 退出群组，模态框 -->

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
        <Button type="primary" @click="editRemark">确定</Button>
      </div>
    </Modal>

  </div>

</template>

<script>
  export default {
    name: "Wap",
    mounted() {
      //this.getInfo()
    },
    data() {
      return {
        active: 'message',   //  显示页面，{'message': 聊天界面， 'friend': 通讯录界面, 'setting': 设置页面}
        user_data: {
          logo: '/static/images/mv1.png',
          nickname: 'xiaoxin',
          username: 'xiaoxin',
          type: 0
        },
        nickname: 'xiaoxin',
        username: 'xiaoxin',

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

        /* ------     消息相关属性    ------- */




        /* ------     群组相关属性    ------- */
        // 当前选择群组
        select_group: null,

        // 点击某个群组
        active_group: false,

        //创建群组模态框
        create_group_modal: false,

        // 创建群组名称
        new_group_name: '',

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
        select_chat: {},            // 当前选择聊天对象
        send_message: '',               // 发送消息内容
        chat_active: null,              // 激活聊天页面
        send_image: null,               // 选择发送图片
        emoji_active: false,            // 表情包
        group_add_modal: false,         // 群组添加成员模态框
        setting_active: false,          // 用户设置框

        chat_setting_show: null,       // 用户设置


        // 用户消息列表
        message_data: {
          group1: [
            {'name': 'test', 'logo': '/static/images/index.png', 'message': 'hello', 'add_time': '8:50'},
            {'name': 'xiaoxin', 'logo': '/static/images/index.png', 'message': 'hello', 'add_time': '8:51'},
            {'name': 'test2', 'logo': '/static/images/index.png', 'message': 'hello', 'add_time': '8:52'},
            {'name': 'test3', 'logo': '/static/images/index.png', 'message': 'hello', 'add_time': '8:53'},
          ],
          friend2: [
            {'id': 2, 'name': 'admin', 'logo': '/static/images/admin.jpg', 'message': 'hello', 'add_time': '8:50'},
            {'id': 1, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'message': 'hello', 'add_time': '8:51'},
            {'id': 2, 'name': 'admin', 'logo': '/static/images/admin.jpg', 'message': 'hello', 'add_time': '8:52'},
            {'id': 1, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'message': '你好，你知道我是谁吗？或许你并不知道，或许你刚认识我，或许你并不了解我，或许你自己都不了解自己', 'add_time': '8:53'},
            {'id': 2, 'name': 'admin', 'logo': '/static/images/admin.jpg', 'message': 'hello', 'add_time': '8:52'},
            {'id': 1, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'message': '你好，你知道我是谁吗？或许你并不知道，或许你刚认识我，或许你并不了解我，或许你自己都不了解自己', 'add_time': '8:53'},
            {'id': 2, 'name': 'admin', 'logo': '/static/images/admin.jpg', 'message': 'hello', 'add_time': '8:52'},
            {'id': 1, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'message': '你好，你知道我是谁吗？或许你并不知道，或许你刚认识我，或许你并不了解我，或许你自己都不了解自己', 'add_time': '8:53'},
            {'id': 2, 'name': 'admin', 'logo': '/static/images/admin.jpg', 'message': 'hello', 'add_time': '8:52'},
            {'id': 1, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'message': '你好，你知道我是谁吗？或许你并不知道，或许你刚认识我，或许你并不了解我，或许你自己都不了解自己', 'add_time': '8:53'},
            {'id': 2, 'name': 'admin', 'logo': '/static/images/admin.jpg', 'message': 'hello', 'add_time': '8:52'},
            {'id': 1, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'message': '你好，你知道我是谁吗？或许你并不知道，或许你刚认识我，或许你并不了解我，或许你自己都不了解自己', 'add_time': '8:53'},
          ]
        },

        // 聊天列表
        chat_list: [
          {'id': 1, 'name': 'test', 'logo': '/static/images/admin.jpg', 'type': 'group', 'chat_id': 1},
          {'id': 2, 'name': 'xiaoxin', 'logo': '/static/images/xiaoxin.jpg', 'type': 'friend', 'chat_id': 2},
        ],

        // 当前聊天名称
        chat_active_name: null,
        chat_active_id: null,


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

        // 第三方网站
        active_frame: null,
      }
    },
    methods: {
      // 跳转到消息页面
      toMessage() {
        this.active = 'message';
      },

      // 跳转到好友页面
      toFriend() {
        this.active = 'friend'
      },

      // 点击某个好友
      clickFriend(index){
        this.select_friend = this.friend_list[index];
        this.active_friend = true;
      },

      // 点击给好友发消息
      clickSendMessage(){

      },

      // 点击修改好友备注名
      clickUpdateRemark(){

      },

      // 跳转到群组页面
      toGroup() {
        this.active = 'group'
      },

      // 跳转到个人设置
      toSetting() {
        this.active = 'setting'
      },

      // 获取个人信息
      async getInfo() {
        let resp = await getUserInfo();
        if (resp.state === 1) {
          this.user_data = resp.data;
        } else {
          this.$Message.warning(resp.message)
        }
      },

      // 进入聊天页面
      changeChat(chat_id, name) {
        this.active_friend = false;
        this.chat_active = true;
        this.chat_active_name = name;
        this.chat_active_id = chat_id;
        this.scrollAuto();
      },
      // 点击表情
      clickEmoji(emoji) {
        this.send_message += '<img src="' + '/static/images/emoji/' + emoji.url + '">';
        this.emoji_active = false;
        setTimeout(() => {
          this.keepLastIndex(document.getElementById('send-message'))
        }, 5)
      },

      // 输入消息
      changeMessage(e) {
        let obj = e.target;
        console.log(obj.innerHTML);
        console.log(obj);
        this.send_message = obj.innerHTML.trim();
        setTimeout(() => {
          this.keepLastIndex(obj)
        }, 5)
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
      async sendImage(){
        this.$Message.warning('......');
        let input = document.getElementById('send-image');
        let file = input.files[0];
        console.log(file.type);
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
      // 删除好友
      delFriend(){
        this.del_friend_modal = false;
        this.$Message.success('好友删除成功！')
      },

      // 取消模态框函数
      modalCancel(){
        this.del_friend_modal = false;
        this.edit_remark_modal = false;
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
