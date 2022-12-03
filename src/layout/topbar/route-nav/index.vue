<template>
  <div class="route-nav" separator="/">
    <el-breadcrumb>
      <el-breadcrumb-item v-for="(item, index) in list" :key="index" :to="item.path">{{
          generateRouteTitle(item.meta.title)
      }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { generateRouteTitle } from "@/utils/i18n.js";

export default {
  setup() {
    const store = useStore();
    const { currentRoute } = useRouter();

    const list = ref([]);

    const menuGroup = computed(() => {
      return store.getters.menuGroup;
    });

    watch(
      () => currentRoute.value,
      (route) => {
        if (route.path.startsWith("/redirect/")) {
          return;
        }
        getBreadcrumb();
      },
      {
        immediate: true,
      }
    );

    function getBreadcrumb() {
      const matched = currentRoute.value.matched.filter(
        (item) => item.meta && item.meta.title
      );
      list.value = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.show !== false
      );
    }

    return {
      menuGroup,
      list,
      generateRouteTitle
    };
  },
};
</script>

<style lang="scss" scoped>
.route-nav {
  :deep .el-breadcrumb {
    margin: 0 10px;

    &__inner {
      font-size: 18px;
      padding: 0 10px;
      font-weight: normal;
      letter-spacing: 1px;
    }
  }
}
</style>