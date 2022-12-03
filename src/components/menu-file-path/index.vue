<template>
  <el-autocomplete
    v-model="filePath"
    :fetch-suggestions="querySearch"
    :trigger-on-focus="true"
    :debounce="100"
    clearable
    style="width: 100%;"
  ></el-autocomplete>
</template>

<script>
import { ref, watch, onMounted } from "vue";
const files = require
  .context("@/", true, /^.\/(views|pages).*(vue|js)/)
  .keys()
  .map((e) => {
    return {
      value: e.substr(2),
    };
  });
export default {
  name: "MenuFilePath",
  props: {
    value: [String],
  },
  setup(props, context) {
    const filePath = ref("");

    const parse = () => {
      filePath.value = props.value || "";
    };

    const querySearch = (qs, cb) => {
      const res = qs ? files.filter(createFilter(qs)) : files;
      cb(res);
    };

    const createFilter = (qs) => {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(qs.toLowerCase()) >= 0;
      };
    };

    watch(
      () => props.value,
      () => {
        parse();
      }
    );

    watch(
      () => filePath.value,
      (value) => {
        context.emit("update:value", value);
      }
    );

    onMounted(() => {
      parse();
    });

    return {
      filePath,
      querySearch,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>