<template>
  <div class="filter-box">
    <div class="filter-switch">
      <span>筛选条件</span>
      <el-switch v-model="show"></el-switch>
    </div>
    <div class="filter-child" v-show="show">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props:{
    initShop:{
      type:Boolean,
      default:false
    }
  },
  setup(props) {
    const show = ref(props.initShop);
    return {
      show,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-switch {
    padding: 0 12px;
  span {
    margin-right: 12px;
    font-size: 13px;
    color: #444;
  }
}

.filter-child {
  margin-top: 20px;
}
</style>