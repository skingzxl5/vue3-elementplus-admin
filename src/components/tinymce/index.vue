<template>
  <div
    :class="{ fullscreen: fullscreen }"
    class="tinymce-container"
    :style="{ width: containerWidth }"
  >
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <editorImage
        color="#1890ff"
        class="editor-upload-btn"
        @successCBK="imageSuccessCBK"
      />
    </div>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  computed,
  watch,
  nextTick,
  onMounted,
  onActivated,
  onDeactivated,
  onUnmounted,
} from "vue";
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from "./components/EditorImage";
import { toolbar, plugins } from "./config";
import load from "./dynamicLoadScript";
import { ElMessage } from "element-plus";

// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN =
  "https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.5/tinymce.min.js";

export default {
  name: "Tinymce",
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function () {
        return (
          "vue-tinymce-" +
          +new Date() +
          ((Math.random() * 1000).toFixed(0) + "")
        );
      },
    },
    value: {
      type: String,
      default: "",
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    menubar: {
      type: String,
      default: "file edit insert view format table",
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360,
    },
    width: {
      type: [Number, String],
      required: false,
      default: "auto",
    },
  },
//   emits: ["input"],
  setup(props, context) {
    const state = reactive({
      hasChange: false,
      hasInit: false,
      tinymceId: props.id,
      fullscreen: false,
      languageTypeList: {
        zh: "zh_CN",
        en: "en",
        es: "es_MX",
        ja: "ja",
      },
    });

    const containerWidth = computed(() => {
      const width = props.width;
      if (/^[\d]+(\.[\d]+)?$/.test(width)) {
        // matches `100`, `'100'`
        return `${width}px`;
      }
      return width;
    });

    watch(
      () => props.value,
      (value) => {
        if (!state.hasChange && state.hasInit) {
          nextTick(() =>
            window.tinymce.get(state.tinymceId).setContent(value || "")
          );
        }
      }
    );

    const init = () => {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          ElMessage.error(err.message);
          return;
        }
        initTinymce();
      });
    };

    const initTinymce = () => {
      window.tinymce.init({
        selector: `#${state.tinymceId}`,
        language: state.languageTypeList["zh"],
        height: props.height,
        body_class: "panel-body ",
        object_resizing: false,
        toolbar: props.toolbar.length > 0 ? props.toolbar : toolbar,
        menubar: props.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: "clean",
        code_dialog_height: 450,
        code_dialog_width: 1000,
        advlist_bullet_styles: "square",
        advlist_number_styles: "default",
        imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
        default_link_target: "_blank",
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: (editor) => {
          if (props.value) {
            editor.setContent(props.value);
          }
          state.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            state.hasChange = true;
            context.emit("update:value", editor.getContent());
          });
        },
        setup(editor) {
          editor.on("FullscreenStateChanged", (e) => {
            state.fullscreen = e.state;
          });
        },
        // it will try to keep these URLs intact
        // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
        // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
        convert_urls: false,
      });
    };

    const destroyTinymce = () => {
      const tinymce = window.tinymce.get(state.tinymceId);
      if (state.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    };

    const setContent = (value) => {
      window.tinymce.get(state.tinymceId).setContent(value);
    };
    const getContent = () => {
      window.tinymce.get(state.tinymceId).getContent();
    };
    const imageSuccessCBK = (arr) => {
      arr.forEach((v) =>
        window.tinymce
          .get(state.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`)
      );
    };

    onMounted(() => {
      init();
    });

    onActivated(() => {
      if (window.tinymce) {
        initTinymce();
      }
    });

    onDeactivated(() => {
      destroyTinymce();
    });

    onUnmounted(() => {
      destroyTinymce();
    });

    return {
      ...toRefs(state),
      containerWidth,
      setContent,
      getContent,
      imageSuccessCBK,
    };
  },
  //   data() {
  //     return {
  //       hasChange: false,
  //       hasInit: false,
  //       tinymceId: this.id,
  //       fullscreen: false,
  //       languageTypeList: {
  //         'zh': 'zh_CN',
  //         'en': 'en',
  //         'es': 'es_MX',
  //         'ja': 'ja'
  //       }
  //     }
  //   },
  //   computed: {
  //     containerWidth() {
  //       const width = this.width
  //       if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
  //         return `${width}px`
  //       }
  //       return width
  //     }
  //   },
  //   watch: {
  //     value(val) {
  //       if (!this.hasChange && this.hasInit) {
  //         this.$nextTick(() =>
  //           window.tinymce.get(this.tinymceId).setContent(val || ''))
  //       }
  //     }
  //   },
  //   mounted() {
  //     this.init()
  //   },
  //   activated() {
  //     if (window.tinymce) {
  //       this.initTinymce()
  //     }
  //   },
  //   deactivated() {
  //     this.destroyTinymce()
  //   },
  //   unmounted() {
  //     this.destroyTinymce()
  //   },
//   methods: {
    // init() {
    //   // dynamic load tinymce from cdn
    //   load(tinymceCDN, (err) => {
    //     if (err) {
    //       this.$message.error(err.message)
    //       return
    //     }
    //     this.initTinymce()
    //   })
    // },
    // initTinymce() {
    //   const _this = this
    //   window.tinymce.init({
    //     selector: `#${this.tinymceId}`,
    //     language: this.languageTypeList['zh'],
    //     height: this.height,
    //     body_class: 'panel-body ',
    //     object_resizing: false,
    //     toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
    //     menubar: this.menubar,
    //     plugins: plugins,
    //     end_container_on_empty_block: true,
    //     powerpaste_word_import: 'clean',
    //     code_dialog_height: 450,
    //     code_dialog_width: 1000,
    //     advlist_bullet_styles: 'square',
    //     advlist_number_styles: 'default',
    //     imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
    //     default_link_target: '_blank',
    //     link_title: false,
    //     nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
    //     init_instance_callback: editor => {
    //       if (_this.value) {
    //         editor.setContent(_this.value)
    //       }
    //       _this.hasInit = true
    //       editor.on('NodeChange Change KeyUp SetContent', () => {
    //         this.hasChange = true
    //         this.$emit('input', editor.getContent())
    //       })
    //     },
    //     setup(editor) {
    //       editor.on('FullscreenStateChanged', (e) => {
    //         _this.fullscreen = e.state
    //       })
    //     },
    //     // it will try to keep these URLs intact
    //     // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
    //     // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
    //     convert_urls: false
    //   })
    // },
    // destroyTinymce() {
    //   const tinymce = window.tinymce.get(this.tinymceId)
    //   if (this.fullscreen) {
    //     tinymce.execCommand('mceFullScreen')
    //   }
    //   if (tinymce) {
    //     tinymce.destroy()
    //   }
    // },
    // setContent(value) {
    //   window.tinymce.get(this.tinymceId).setContent(value)
    // },
    // getContent() {
    //   window.tinymce.get(this.tinymceId).getContent()
    // },
    // imageSuccessCBK(arr) {
    //   arr.forEach(v => window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`))
    // }
//   },
};
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.tinymce-container {
  :deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>
