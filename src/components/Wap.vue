<template>
    <div class="wap-main">
      <div class="wap-main-title">
        <div class="text" @click="create_group_modal=!create_group_modal">
          在线聊天室
          <Icon type="md-arrow-dropdown" size="24"/>
          <div class="wap-create-group-modal" v-show="create_group_modal">
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
        <div class="wap-main-body-message" v-if="active==='message'">
          聊天页面
        </div>
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

        </div>
        <div class="wap-main-body-setting" v-if="active==='setting'">
          个人设置
        </div>
      </div>
      <div class="wap-main-bottom">
        <ul>
          <li :class="'wap-main-bottom-chat' + (active==='message'?' active':'')" @click="toMessage">
            <div>
              <Icon type="md-text" size="32"/>
            </div>
            <p>聊天</p>
          </li>
          <li @click="toFriend" :class="active==='friend'?'active':''">
            <div>
              <Icon type="ios-list-box" size="32"/>
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
            create_group_modal: false,      // 点击在线聊天室创建群组，添加好友框
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
