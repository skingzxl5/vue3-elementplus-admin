<template>
  <template v-if="!!item.meta.show">
    <el-menu-item
        v-if="!item.children || !item.children.length"
        :index="item.path"
    >
      <icon-svg v-if="item.meta.icon" :name="item.meta.icon"/>
      <span class="title">{{ generateRouteTitle(item.meta.title) }}</span>
    </el-menu-item>

    <el-sub-menu v-else :index="item.path">
      <template #title>
        <icon-svg v-if="item.meta.icon" :name="item.meta.icon"/>
        <span class="title">{{ generateRouteTitle(item.meta.title) }}</span>
      </template>
      <side-menu-item v-for="child in item.children" :key="child.path" :item="child" />
    </el-sub-menu>
  </template>
</template>

<script>
import sideMenuItem from './side-menu-item';
import { generateRouteTitle } from "@/utils/i18n.js";
export default {
  components: {sideMenuItem},
  props: {
    item: Object,
  },
  setup() {
    return {generateRouteTitle};
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-left: 10px;
}
</style>