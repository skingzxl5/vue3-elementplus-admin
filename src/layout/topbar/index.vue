<template>
  <el-header class="topbar-wrap" height="70px">
    <div class="topbar__collapse" @click="collapse">
      <icon-svg v-if="menuCollapse" size="small" name="indent" />
      <icon-svg v-else size="small" name="outdent" />
    </div>

    <div class="topbar__route-nav">
      <route-nav />
    </div>

    <div class="topbar__flex"></div>

    <div class="topbar__user">
      <el-button-group>
        <el-button
          title="刷新"
          style="border: none; font-size: 20px"
          circle
          plain
          @click="reload()"
        >
          <el-icon :size="20" style="vertical-align: middle">
            <Refresh />
          </el-icon>
        </el-button>
        <el-button
          title="全屏"
          style="border: none; font-size: 20px"
          circle
          plain
          @click="toggle()"
        >
          <el-icon :size="14" style="vertical-align: middle">
            <full-screen />
          </el-icon>
        </el-button>
        <el-button
          :title="dark ? '夜间模式' : '明亮模式'"
          style="border: none; font-size: 20px"
          circle
          plain
          @click="toggleTheme()"
        >
          <el-icon :size="14" style="vertical-align: middle">
            <component :is="dark ? 'moon' : 'sunny'" />
          </el-icon>
        </el-button>
      </el-button-group>
      <lang-select class="right-menu-item"/>
      <el-dropdown :hide-on-click="false" trigger="click" @command="onCommand">
        <span class="el-dropdown-link">
          <span class="name">{{ userInfo.stName }}</span>
          <el-avatar :size="32" :src="userInfo.headImgUrl"></el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { useStore } from "vuex";
import { inject, reactive, computed, toRefs } from "vue";
import { useRouter } from "vue-router";
import RouteNav from "./route-nav";
import { useFullscreen } from "@vueuse/core";
import LangSelect from "@/components/LangSelect";

export default {
  components: { RouteNav, LangSelect },
  setup() {
    let state = reactive({
      dark: false,
    });
    const store = useStore();
    const router = useRouter();

    const { toggle } = useFullscreen();

    // const dark = ref(false);
    const reload = () => {
      inject("reload");
    };

    const userInfo = computed(() => {
      let userInfo = store.getters.userInfo;
      console.log("用户信息",userInfo)
      return {
        ...userInfo,
        // headImgUrl:userInfo.avatar
        headImgUrl:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
      };
    });

    const menuCollapse = computed(() => {
      return store.getters.menuCollapse;
    });

    const collapse = () => {
      store.commit("menu/SET_COLLASPE", !menuCollapse.value);
    };

    const toggleTheme = () => {
      state.dark = !state.dark;
      document.documentElement.classList.toggle("dark");
    };
    const onCommand = (name) => {
      switch (name) {
        case "userInfo":
          router.push("/my/info");
          break;
        case "logout":
          store.dispatch("user/logout").then(() => {
            router.push({
              path: "/login",
              replace: true,
            });
          });
          break;
      }
    };

    return {
      ...toRefs(state),
      collapse,
      userInfo,
      menuCollapse,
      onCommand,
      toggleTheme,
      toggle,
      reload,
    };
  },
};
</script>

<style lang="scss" scoped>
.topbar-wrap {
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #fff;
  // margin-bottom: 10px;

  .topbar__collapse {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    cursor: pointer;

    svg {
      font-size: 24px;
    }
  }

  .topbar__flex {
    flex: 1;
  }

  .topbar__user {
    cursor: pointer;
    margin-right: 10px;

    .el-dropdown-link {
      display: flex;
      align-items: center;
    }

    .name {
      white-space: nowrap;
      margin-right: 15px;
    }
  }
      .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
}
</style>
