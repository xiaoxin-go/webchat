<template>
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
      <div class="wap-main-body">
        <!--  聊天界面  -->
        <div class="wap-main-body-message" v-if="active==='message'">
            <template v-for="(chat, index) in chat_list">
              <div :class="'chat-item ' + (chat_active===index?'active':'')" @click="changeChat(index)">
                <div class="chat-img">
                  <img :src="chat.logo">
                </div>
                <div class="chat-text">
                  {{ chat.remark_name }}
                </div>
              </div>
            </template>
        </div>

        <!--   好友界面  -->
        <div class="wap-main-body-friend" v-if="active==='friend'">
          <div class="wap-main-body-friend-search">
            <Input search placeholder="搜索" size="large"/>
          </div>
          <div class="wap-main-body-friend-title">
            <div class="wap-main-body-friend-new">
              <div><img src="/static/images/apply_list.png" alt=""></div>
              <p>新朋友</p>
            </div>
            <div class="wap-main-body-friend-group">
              <div><img src="/static/images/create_group.png" alt=""></div>
              <p>群组</p>
            </div>
            <div class="wap-main-body-friend-add">
              <div><img src="/static/images/search_add_friend.png" alt=""></div>
              <p>添加好友</p>
            </div>
          </div>

          <!-- 好友 -->
          <div class="wap-main-body-friend-body">
            <template v-for="(friend, index) in friend_list">
              <div class="chat-item" @click="changeFriend(index)">
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
                <Icon type="ios-arrow-forward" />
              </div>

            </div>
            <div class="wap-main-body-setting-body-item">
              <div class="wap-main-body-setting-body-item-text">
                清空站点聊天记录
              </div>
              <div class="wap-main-body-setting-body-item-icon">
                <Icon type="ios-arrow-forward" />
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
          <li @click="toFriend" :class="active==='friend'?'active':''">
            <div>
              <Icon type="ios-contacts" size="32"/>
            </div>
            <p>
              通讯录
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
</template>

<script>
    export default {
        name: "Wap",
      data(){
          return{
            active: 'message',   //  显示页面，{'message': 聊天界面， 'friend': 通讯录界面, 'setting': 设置页面}
            user_data: {
              logo: '/static/images/index.png',
              nickname: 'xiaoxin',
              username: 'xiaoxin'
            },
            nickname: 'xiaoxin',
            username: 'xiaoxin',

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
            click_chatroom_modal: false,      // 点击在线聊天室创建群组，添加好友框

            /* ------     消息相关属性    ------- */




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



            /* ------     好友相关属性    ------- */
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
              {'username': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin1', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin2', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin3', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin4', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin5', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin6', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin7', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin8', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin9', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin10', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
              {'username': 'xiaoxin11', 'logo': '/static/images/index.png', 'type': 'chat', 'nickname': 'xiaoxin', 'remark_name': 'xiaoxin'},
            ],



            /* ------     用户相关属性    ------- */
            select_chat: {},            // 当前选择聊天对象
            send_message: '',               // 发送消息内容
            chat_active: null,              //
            send_image: null,               // 选择发送图片
            emoji_active: false,            // 表情包
            group_add_modal: false,         // 群组添加成员模态框
            setting_active: false,          // 用户设置框

            chat_setting_show: null,       // 用户设置
            del_friend_modal: false,       // 删除好友
            edit_remark_modal: false,      // 修改备注
            new_remark_name: '',            // 新备注名

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
              {'username': 'test', 'logo': '/static/images/index.png', 'type': 'group', 'remark_name': 'test'},
              {'username': 'xiaoxin', 'logo': '/static/images/index.png', 'type': 'chat', 'remark_name': 'xiaoxin'},
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
          }
      },
      methods:{
          // 跳转到消息页面
          toMessage(){
            this.active = 'message';
          },

          // 跳转到好友页面
          toFriend(){
            this.active = 'friend'
          },

          // 跳转到个人设置
          toSetting(){
            this.active = 'setting'
          }
      }
    }
</script>

<style scoped>

</style>
