<template>
  <div id="app">
    <router-view/>
    <div v-if="show==='pc'">
      <Tab></Tab>
    </div>

  </div>
</template>

<script>
  import Tab from './components/pc/Tab.vue'
export default {
  name: 'App',
  data(){
    return {
      show: 'pc'
    }
  },
  mounted() {
    if (document.body.clientWidth>500){
      this.show = 'pc'
    }else{
      this.show = 'wap'
    }
    this.$socket.emit('in_chat')
  },
  components:{Tab}
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
