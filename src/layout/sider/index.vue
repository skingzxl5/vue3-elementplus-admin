<template>
  <div class="sider-wrap">
    <div v-if="!collapse" class="logo">
      <img src="@/assets/heard.png" alt="" style="width: 260px;height:100%;" />
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :collapse="collapse" :default-active="activedPath" background-color="#304156" class="sider-menu"
        menu-trigger="click" router text-color="#FFFFFF" unique-opened>
        <side-menu-item v-for="route in routeList" :key="route.path" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import config from '@/config'
import _ from 'lodash';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import sideMenuItem from './side-menu-item';
// import sideMenu from './side-menu';

export default {
  components: { sideMenuItem },
  props: {
    collapse: Boolean,
  },
  setup(props) {
    const { currentRoute } = useRouter();
    const store = useStore();
    const isCollapse = ref(false);
    console.log(store)

    let routeList = computed(() => {
      if (store.getters.menuGroup && store.getters.menuGroup.length > 0) {
        return store.getters.menuGroup;
      }
      return [];
    });

    console.log(routeList)

    const handleResize = (e) => {
      let innerWidth = e.target.innerWidth;
      if (innerWidth < 780 && !props.collapse) {
        store.commit('menu/SET_COLLASPE', true);
      } else if (innerWidth > 1200 && props.collapse) {
        store.commit('menu/SET_COLLASPE', false);
      }
    };

    onMounted(() => {
      window.addEventListener('resize', _.debounce(handleResize, 200), true);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize, true);
    });

    const activedPath = computed(() => {
      const { path } = currentRoute.value;
      return path;
    });

    return {
      config,
      routeList,
      isCollapse,
      activedPath,
    };
  },
};
</script>

<style lang="scss" scoped>
.sider-wrap {
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

  .sider-menu {
    &:not(.el-menu--collapse) {
      width: 260px;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;

    .logo-title {
      color: #fff;
      font-size: 30px;
      text-align: center;
    }

    .collapse {
      width: 64px !important;
    }
  }

  .menu {
    overflow-y: auto;
    height: calc(100% - 80px);

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .el-menu {
    border-right: 0px;
  }
}
</style>