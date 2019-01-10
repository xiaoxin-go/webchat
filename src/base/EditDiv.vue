<template>
  <div contenteditable="true"
       class="send-message"
       v-html="innerText"
       @input="changeText"></div>
</template>
<script>
  export default {
    props: ['value'],
    data(){
      return {innerText:this.value}
    },
    methods:{
      changeText(){
        this.innerText = this.$el.innerHTML;
        this.$emit('input',this.innerText);
      }
    }
  }
</script>
