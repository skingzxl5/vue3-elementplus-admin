<template>
  <el-dropdown :hide-on-click="false" trigger="click" @command="handleSetLanguage">
    <div>
      <icon-svg size="small" name="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
      <el-dropdown-item :disabled="language==='zh-cn'" command="zh-cn">
        中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import {computed} from 'vue';
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { ElMessage } from 'element-plus'
export default {
  setup() {
    const { t, locale, getLocaleMessage, mergeLocaleMessage } = useI18n({
      useScope: "global",
    });
    const store = useStore();

    const language = computed({
      get: () => store.getters.language,
      set: (language) => {
        locale.value = language;
        store.dispatch("app/setLanguage", language);
      },
    });

    const handleSetLanguage = (lang)=>{
      console.log("切换语言",lang)
      locale.value = lang;
      store.dispatch('app/setLanguage', lang)
      ElMessage({
        message: 'Switch Language Success',
        type: 'success'
      })
    }

    if (!getLocaleMessage("en")['i18nView']) {
      mergeLocaleMessage("en", locale.en);
      mergeLocaleMessage("zh-cn", locale.zh);
    }

    return {
     t,
     language,
     handleSetLanguage
    };

  }
}
</script>
