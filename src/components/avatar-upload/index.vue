<template>
  <div class="avatar-upload-wrap">
    <div class="avatar-upload">
      <el-input
        class="avatar-upload__hidden"
        type="hidden"
        v-model="value"
      ></el-input>
      <el-upload
        action=""
        :accept="accept"
        :headers="{
          Authorization: token,
          ...headers,
        }"
        :http-request="
          (e) => {
            httpRequest(e);
          }
        "
        :data="data"
        :show-file-list="false"
        :name="name"
        :drag="drag"
        :limit="1"
        list-type="default"
        :disabled="disabled"
        :on-success="onSuccess"
        :on-error="onError"
        :on-progress="onProgress"
        :on-change="onChange"
        :before-upload="beforeUpload"
        :before-remove="beforeRemove"
        :style="style"
      >
        <slot>
          <div class="avatar-upload__cover" v-if="fileList[0]">
            <img  :src="fileList[0].url" />
          </div>

          <template v-else>
            <i :class="['avatar-upload__icon', icon]"></i>
            <span class="avatar-upload__text" v-if="text">{{ text }}</span>
          </template>
        </slot>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { uploadFile } from "@/api/app";
import { useStore } from "vuex";
import { reactive, toRefs, computed, watch } from "vue";
import _ from "lodash";
export default {
  name: "AvatarUpload",
  props: {
    modelValue: [Array, String],
    size: {
      type: [Array, String, Number],
      default: "128px",
    },
    icon: {
      type: String,
      default: "el-icon-upload",
    },
    text: {
      type: String,
      default: "选择文件",
    },
    headers: Object,
    data: Object,
    drag: Boolean,
    name: {
      type: String,
      default: "file",
    },
    onSuccess: Function,
    onError: Function,
    onProgress: Function,
    onChange: Function,
    beforeUpload: Function,
    beforeRemove: Function,
    disabled: Boolean,
  },
  setup(props, context) {
    const state = reactive({
      loading: false,
      fileList: [],
    });

    const token = computed(() => {
      return useStore().getters.token;
    });

    const style = computed(() => {
      let arr = [];
      if (_.isArray(props.size)) {
        arr = props.size;
      } else {
        arr = [props.size, props.size];
      }

      const [height, width] = arr.map((e) => (_.isNumber(e) ? `${e}px` : e));

      return {
        height,
        width,
      };
    });

    watch(()=>props.modelValue, (value)=>{
      let list = [value];
      if (list.join(",") !== state.fileList.map((e) => e.url).join(",")) {
        state.fileList = list.filter(Boolean).map((url) => {
          return {
            url,
            uid: url,
          };
        });
      }
    }, {
      immediate: true,
    });

    const accept = computed(() => {
      return "image/*";
    });

    const emit = () => {
      const urls = state.fileList
        .map((e) => e.url)
        .filter(Boolean)
        .join(",");
      context.emit("update:modelValue", urls);
      context.emit("change", urls);
    };

    // 自定义上传请求
    const httpRequest = (req) => {
      state.loading = true;
      const param = new FormData();
      param.append("file", req.file);
      uploadFile(param)
        .then((response) => {
          if (response.code == 200) {
            state.fileList = [
              {
                url: response.data.url,
                name: req.file.name,
                uid: req.file.uid,
              },
            ];
            emit();
            // 上传成功钩子
            if (props.onSuccess) {
              props.onSuccess(response.data, req.file, state.fileList);
            }
          }
          state.loading = false;
        })
        .catch((error) => {
          console.error("upload error", error);
          ElMessage.error(error);

          // 上传失败钩子
          if (props.onError) {
            props.onError(error, req.file);
          }
          state.loading = false;
        });
    };

    return {
      ...toRefs(state),
      style,
      token,
      accept,
      httpRequest,
    };
  },
};
</script>

<style lang="scss" scoped>
.avatar-upload-wrap {
  width: 100%;

  .avatar-upload {
    display: flex;
    flex-wrap: wrap;

    .avatar-upload__hidden {
      width: 0;
      height: 0;
    }

    :deep .el-upload {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      height: 100%;

      &:hover {
        border-color: #409eff;
      }

      .avatar-upload__cover {
        img {
          display: block;
          height: 100%;
          width: 100%;
        }
      }

      i {
        font-size: 28px;
        color: #8c939d;
      }
    }
  }
}
</style>