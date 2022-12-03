<template>
  <div class="error-page">
    <div class="error-content">
      <el-button type="primary" icon="el-icon-arrow-left" @click="back" >返回</el-button>
      <h3 class="text">你没有权限去该页面</h3>
    </div>
    <div class="error-401">
      <img src="@/assets/error/401.png" alt="" />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name:'error401',
  setup() {
    let router = useRouter();
    const back = () => {
      router.back();
    };
    return {
      back,
    };
  },
};
</script>

<style lang="scss" scoped>
.error-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .error-content {
    width: 400px;

    .text {
      margin-top: 20px;
    }
  }
  .error-401 {
    width: 300px;
    height: 300px;

    img {
      width: 100%;
    }
  }
}
</style>