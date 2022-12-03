<template>
    <div class="login-container">
      <div class="login-contant">
        <div class="login-contantLeft">
          <div style="font-size: 42px;font-weight: bold;color: #FCFEFE;margin:10% 0 0 10%">ADMIN SYSTEM</div>
          <div style="font-size: 30px;font-weight: bold;color: #b0d0fe;margin:4% 0 0 10%">数据中心展示页面</div>
        </div>
        
      </div>
    </div>
  </template>
  
  <script>
  import { reactive,toRefs } from "vue";
  export default {
    setup() {

      let state = reactive({
        uuid:"",
      });

      return {
        ...toRefs(state),
      };
    },
    created() {
    }
  };
  </script>
  <style scoped>

  </style>
  
  