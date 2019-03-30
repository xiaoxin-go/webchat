<template>
  <div id="app">
    <router-view/>
    <div v-if="show==='pc'">
      <Tab></Tab>
    </div>
    <MyFrame url="http://www.baidu.com" v-show="frame_show"></MyFrame>
    <div class="my-frame-btn" @click="frame_show=!frame_show"><Icon type="md-bonfire" size="30" /></div>
  </div>
</template>

<script>
  import Tab from './components/pc/Tab.vue'
  import MyFrame from './base/Frame.vue'
export default {
  name: 'App',
  data(){
    return {
      show: 'pc',
      frame_show: false,
    }
  },
  mounted() {
    this.$User.setUser({
      id: 1,
      type: 0,
      username: 'xiaoxin',
      logo: '/static/images/mv1.jpeg',
      nickname: '小新'
    });
    if (document.body.clientWidth>500){
      this.show = 'pc'
    }else{
      this.show = 'wap'
    }
    this.$socket.emit('in_chat')
  },
  components:{Tab, MyFrame}
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
