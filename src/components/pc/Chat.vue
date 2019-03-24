<template>
  <div>
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
                {{ chat.remark_name }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    右侧消息框
    <div id="right">
      <!--    用户聊天界面    -->
        <div class="right-title">
          <span>{{select_chat.remark_name}}</span>
          <div class="right-title-settings">
            <div v-if="select_chat.type==='group'" class="right-title-setting" @click="group_add_modal=true">
              <Icon type="md-add" />
            </div>
            <div v-if="select_chat.username" class="right-title-setting" @click="changeSettingShow">
              <Icon type="md-cog" />
            </div>
          </div>
        </div>
        <div>
          <div :class="chat_setting_show?'right-main-show':'right-main'">
            <div class="right-body">
              <template v-for="message in message_data[select_chat.name]">
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
          <!--  用户组设置栏 -->
          <div v-show="chat_setting_show==='group'" class="settings-show">
            <div class="settings-group">
              <div class="group-pople">
                <p>群成员</p>
                <div class="group-logo">
                  <img src="" alt="">
                </div>
                <p>所有成员</p>
              </div>
              <div>
                群组名称
              </div>
              <div>
                禁言
              </div>
              <div>
                解散群
              </div>
            </div>
          </div>

          <!--  单聊设置栏  -->
          <div v-show="chat_setting_show==='chat'" class="settings-show">
            <div class="settings-chat">
              <img :src="logo" alt="">
              <p>{{select_chat.nickname}}</p>
              <p class="username">ID: {{select_chat.username}}</p>
            </div>
            <div class="settings-chat-item" @click="edit_remark_modal=true">
              <span>修改备注</span><span class="settings-chat-item-icon"><Icon type="ios-arrow-forward" size="22"/></span>
            </div>
            <div class="settings-chat-item" @click="del_friend_modal=true">
              删除好友
            </div>
          </div>

        </div>
    </div>
  </div>

</template>

<script>
  import {uploadLogo, updateUser,  getChat} from '../../api/index.js';
  import Edit from '../../base/EditDiv.vue';

  export default {
    name: 'Home',
    components:{Edit},
    data(){
      return {
        /*--------  用户消息相关属性  --------*/
        select_chat: {},            // 当前选择聊天对象
        send_message: '',               // 发送消息内容
        chat_active: null,              //
        send_image: null,               // 选择发送图片
        emoji_active: false,            // 表情包

        // 用户消息列表
        message_data:[],

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
    created(){
      this.getData();
    },
    mounted(){
    },
    /*****************************************    方法区    ******************************************/
    methods:{
      /*--------------     chat相关方法      -----------------------*/
      // 获取聊天消息
      async getChat() {
        let resp = await getChat();
        console.log(resp);
        if (resp.code === 200) {
          this.chat_list = resp.data;
        } else {
          this.$Message.error(resp.message)
        }
      },
      // 删除聊天
      async delChat(chat){
        let json_data = {
          chat_id: chat.id
        };
        let resp = await deleteChat(json_data);
        if(resp.code === 200){
          this.getChat();
        }
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
        this.select_chat = this.chat_list[index];
      },

      // 点击表情
      clickEmoji(emoji){
        this.send_message += ''+ '<img src="/static/images/emoji">' + emoji.url +'';
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

      // 点击设置和添加按钮
      changeSettingShow(){
        this.chat_setting_show = this.chat_setting_show===this.select_chat.type?null:this.select_chat.type
      },

      /*------------------         公共方法               -------------------------*/
      // 取消模态框
      modalCancel(){
      },

      send(data) {
        console.log(this.chat);
        let message_data = {
          chat: this.chat,
          message: this.send_message,
          user_data: this.user
        };
        this.$socket.emit('message', message_data);
        this.message_data.push({
          ...this.user, ...{message: this.send_message}
        });
        this.send_message = '';
        this.scrollAuto();
      },
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      response: function (chat) {
        console.log(chat.chat_data);
        let chat_data = chat.chat_data;
        let chat_item = this.chat_list.filter(item=>item.id === chat_data.id)[0];
        let chat_index = this.chat_list.indexOf(chat_item);
        this.chat_list.splice(chat_index, 1);
        this.chat_list.unshift(chat_data);
        console.log(val.user_data);
        this.message_data.push(val.user_data);
        this.scrollAuto();
      }
    },
  }
</script>

<style>

</style>
