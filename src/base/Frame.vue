<template>
  <div class="my-frame">
    <!--<div v-html="html"></div>-->
    <iframe src="https://hello.yy.com/" width="100%" height="100%" frameborder="0"></iframe>
  </div>
</template>
<style>

</style>
<script>
  import {getHtml} from "../api";

  export default{
    // 使用时请使用 :url.sync=""传值
    props: {
      url: {
        required: true
      }
    },
    data () {
      return {
        loading: false,
        html: ''
      }
    },
    watch: {
      url (value) {
        this.load(value)
      }
    },
    mounted () {
      this.load()
    },
    methods: {
      async load(){
        let resp = await getHtml();
        this.html = resp.data;
      }
    }
  }
</script>
