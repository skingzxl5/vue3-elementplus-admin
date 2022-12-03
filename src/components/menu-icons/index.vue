<template>
  <div class="menu-icons">
    <el-popover
      ref="popover"
      placement="bottom-start"
      trigger="click"
      popper-class="popper-menu-icon"
      width="480"
    >
      <el-row :gutter="10" class="list">
        <el-col :span="3" v-for="(item, index) in list" :key="index">
          <el-button
            size="mini"
            :class="{ 'is-active': item === value }"
            @click="onSelect(item)"
          >
            <icon-svg :name="item" />
          </el-button>
        </el-col>
      </el-row>

      <template #reference>
        <el-input :value="value" readonly placeholder="请选择"></el-input>
      </template>
    </el-popover>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, ref } from "vue";
import { iconList } from "@/icons";
export default {
  name: "MenuIcons",
  props: {
    value: String,
  },
  setup(props, context) {
      const popover = ref(null)
    const state = reactive({
      list: [],
    });

    const onSelect = (icon) => {
      context.emit("update:value", icon);
    };

    onMounted(() => {
      state.list = iconList();
    });
    return {
        popover,
      ...toRefs(state),
      onSelect,
    };
  },
};
</script>

<style lang="scss" >
.popper-menu-icon {
  width: 480px;
  box-sizing: border-box;

  .list {
    height: 250px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .el-button {
    margin-bottom: 10px;
    height: 40px;
    width: 100%;
    padding: 0;

    .icon-svg {
      font-size: 18px;
      color: #444;
    }
  }
}
</style>