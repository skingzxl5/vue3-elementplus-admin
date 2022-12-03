<template>
  <el-config-provider :locale="locale">
    <div id="root">
      <router-view />
    </div>
  </el-config-provider>
</template>

<script>
import { ElConfigProvider } from 'element-plus'
import { defineComponent, reactive, toRefs, computed } from "vue";
import { useStore } from "vuex";
import enLocale from 'element-plus/lib/locale/lang/en';
import zhLocale from 'element-plus/lib/locale/lang/zh-cn';

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  watch: {
    lang(newVal) {
      if (newVal == "en") {
        this.locale = enLocale
      } else {
        this.locale = zhLocale
      }
    }
  },
  setup() {
    const store = useStore()
    const state = reactive({
      locale: zhLocale
    });
    const lang = computed({
      get: () => store.getters.language,
    });
    return {
      ...toRefs(state),
      enLocale,
      zhLocale,
      lang
    }
  },
})
</script>

<style lang="scss" >
</style>
