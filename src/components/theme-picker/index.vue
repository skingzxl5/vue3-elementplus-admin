<template>
  <el-color-picker
    v-model="theme"
    :predefine="[
      '#409EFF',
      '#1890ff',
      '#304156',
      '#212121',
      '#11a983',
      '#13c2c2',
      '#6959CD',
      '#f5222d',
    ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
import { useStore } from 'vuex';
import { computed, getCurrentInstance, reactive, toRefs, watch } from 'vue';
const version = require('element-plus/package.json').version; // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF'; // default color

export default {
  emits: ['change'],
  setup(_, context) {
    const store = useStore();
    const ctx = getCurrentInstance();
    const state = reactive({
      chalk: '',
      theme: store.state.settings.theme || ORIGINAL_THEME,
    });

    const defaultTheme = computed(() => {
      return store.state.settings.theme;
    });

    watch(defaultTheme, (value) => {
      state.theme = value;
    });

    const getThemeCluster = (theme) => {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);
        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(',');
        } else {
          red += Math.round(tint * (255 - red));
          green += Math.round(tint * (255 - green));
          blue += Math.round(tint * (255 - blue));
          return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
        }
      };

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);
        red = Math.round((1 - shade) * red);
        green = Math.round((1 - shade) * green);
        blue = Math.round((1 - shade) * blue);
        return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
      };

      const clusters = [theme];
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
      }
      clusters.push(shadeColor(theme, 0.1));
      return clusters;
    };

    const getCSSString = (url, variable) => {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            ctx[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '');
            resolve();
          }
        };
        xhr.open('GET', url);
        xhr.send();
      });
    };

    const updateStyle = (style, oldCluster, newCluster) => {
      let newStyle = style;
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
      });
      return newStyle;
    };

    watch(
      () => state.theme,
      async (value) => {
        if (value) {
          const oldValue = state.chalk ? state.theme : ORIGINAL_THEME;
          const themeCluster = getThemeCluster(value.replace('#', ''));
          const originalCluster = getThemeCluster(oldValue.replace('#', ''));

          if (!state.chalk) {
            const url = `https://unpkg.com/element-plus@${version}/lib/theme-chalk/index.css`;
            await getCSSString(url, 'chalk');
          }
          const getHandler = (variable, id) => {
            return () => {
              const originalCluster = getThemeCluster(ORIGINAL_THEME.replace('#', ''));
              const newStyle = updateStyle(ctx[variable], originalCluster, themeCluster);
              let styleTag = document.getElementById(id);
              if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.setAttribute('id', id);
                document.head.appendChild(styleTag);
              }
              styleTag.innerText = newStyle;
            };
          };

          const chalkHandler = getHandler('chalk', 'chalk-style');
          chalkHandler();

          let styles = [].slice.call(document.querySelectorAll('style'));
          styles = styles.filter((style) => {
            const text = style.innerText;
            return new RegExp(oldValue, 'i').test(text) && !/Chalk Variables/.test(text);
          });
          styles.forEach((style) => {
            const { innerText } = style;
            if (typeof innerText !== 'string') return;
            style.innerText = updateStyle(innerText, originalCluster, themeCluster);
          });

          context.emit('change', value);
        }
      }
    );

    return {
      defaultTheme,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss">
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
