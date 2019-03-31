<template>
  <div style="height: 100%;">

    <!--聊天列表-->
    <div id="center">
      <div class="search">
        <Input type="text" @keyup.enter.native="search" placeholder="search..." v-model="search_value">
          <Icon type="ios-search" slot="prefix" />
        </Input>
      </div>

      <!------------------       群组列表     ----------------->
      <div class="center-body">
        <div class="center-item" v-if="$User.user.type < 2">
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
            <div :class="'chat-item ' + (select_group===group?'active':'')" @click="select_group=group">
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
    </div>

    <GroupInfo :group="select_group"></GroupInfo>
    <!--右侧消息框-->

    <!--  创建群组模态框 -->
    <Modal
      v-model="create_group_modal"
      @on-cancel="create_group_modal=false"
      title="创建群组"
      class-name="my-modal" width="400px">
      <div style="margin-bottom: 10px;text-align: center;">
        <Icon class="message-file" v-if="!new_group_logo" type="ios-add-circle-outline" size="100" @click="clickImage"/>
        <img style="height: 200px;width: 200px;border-radius: 50%;" v-if="new_group_logo" :src="new_group_logo" alt="" @click="uploadImage">
      </div>
      <div class="my-modal-input">
        <input type="text" placeholder="请输入群组名称" v-model="new_group_name">
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="create_group_modal=false">取消</Button>
        <Button type="primary" size="large" @click="createGroup">确定</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import { getGroup,  addGroup, uploadLogo} from '../../api/index.js';
  import GroupInfo from './GroupInfo.vue'
  export default {
    name: 'Home',
    components:{GroupInfo},
    data(){
      return {
        search_value: '',     // 搜索框内容
        /* ------     群组相关属性    ------- */
        // 当前选择群组
        select_group:{},

        //创建群组模态框
        create_group_modal: false,

        // 创建群组名称
        new_group_name: '',
        new_group_logo: '',

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
      }
    },
    created(){
    },
    /*****************************************    方法区    ******************************************/
    methods:{
      // 获取群组列表
      async getGroup(){
        let resp = await getGroup();
        console.log(resp);
        if(resp.code === 200){
          this.group_list = resp.data;
        }else{
          this.$Message.error(resp.message);
        }
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
          this.new_group_logo = this.$Server + resp.data.url;        // 返回的是头像路径
        }
      },
      // 搜索群组
      search(){
        this.$Message.info(this.search_value)
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
          group_name: this.new_group_name,
          group_logo: this.new_group_logo
        };
        let resp = await addGroup(json_data);
        if (resp.code === 200){
          this.$Message.success('群组创建成功！');
          this.getGroup();
        }else{
          this.$Message.error(resp.message);
        }
      },
    },
  }
</script>

<style>

</style>
