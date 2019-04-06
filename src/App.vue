<template>
  <div id="app">
    <router-view/>
    <template v-if="show==='pc'">
      <pcTab></pcTab>
    </template>
    <template v-else>

    </template>
    <!--<MyFrame url="http://www.baidu.com" v-show="frame_show"></MyFrame>-->
    <!--<div class="my-frame-btn" @click="frame_show=!frame_show"><Icon type="md-bonfire" size="30" /></div>-->
  </div>
</template>

<script>
  import pcTab from './components/pc/Tab.vue'
  import MyFrame from './base/Frame.vue'
  import {checkLogin} from "./api";
export default {
  name: 'App',
  data(){
    return {
      frame_show: false,
      show: ''
    }
  },
  created(){
    this.$socket.emit('in_chat');
    if(document.body.clientWidth>500){
      this.show = 'pc'
    }else{
      this.show = 'wap'
    }
  },
  methods:{
  },
  mounted() {
    window.addEventListener( 'beforeunload', e => this.$socket.emit('out_chat') );
  },
  destroyed(){
    console.log('exit.........');
    this.$socket.emit('out_chat')
  },
  components:{pcTab, MyFrame}
}
</script>

<style>
#app {
  overflow: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
 @media screen and (max-width: 500px){
   #pc{
     display: none;
   }
 }
</style>
