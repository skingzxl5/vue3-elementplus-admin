<template>
  <div class="menu-tree">
    <el-popover
      ref="popover"
      placement="bottom-start"
      trigger="click"
      popper-class="popper-menu-tree"
      width="480"
    >
      <el-input size="small" v-model="filterValue">
        <template #prefix>
          <i class="el-input__icon el-icon-search"></i>
        </template>
      </el-input>

      <el-tree
        ref="tree"
        node-key="id"
        :data="treeList"
        :props="props"
        :highlight-current="true"
        :expand-on-click-node="false"
        :default-expanded-keys="expandedKeys"
        :filter-node-method="filterNode"
        @current-change="currentChange"
      >
      </el-tree>

      <template #reference>
        <el-input :value="title" readonly placeholder="请选择"></el-input>
      </template>
    </el-popover>
  </div>
</template>

<script>
import { reactive, ref, toRefs, computed, watch, onMounted } from "vue";
import { deepTree } from "@/utils";
export default {
  name: "MenuTree",
  props: {
    value: [String, Number],
    menuList: Array,
  },
  setup(props, context) {
    const tree = ref(null);
    const popover = ref(null);
    const state = reactive({
      filterValue: "",
      list: [],
      props: {
        label: "title",
        children: "children",
      },
      expandedKeys: [],
    });

    watch(
      () => state.filterValue,
      (value) => {
        tree.value.filter(value);
      }
    );

    const treeList = computed(() => {
      return deepTree(state.list);
    });

    const title = computed(() => {
      const item = props.menuList.find((e) => e.id == props.value);
      return item ? item.title : "一级菜单";
    });

    const currentChange = ({ id }) => {
      context.emit("update:value", id);
    };

    const initMenuList = () => {
      let list = props.menuList.filter((e) => e.type != 2);
      list.unshift({
        title: "一级菜单",
        id: 0,
      });
      state.list = list;
    };

    const filterNode = (value, data) => {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    };

    onMounted(() => {
      initMenuList();
    });

    return {
      popover,
      tree,
      ...toRefs(state),
      treeList,
      title,
      currentChange,
      filterNode,
    };
  },
};
</script>

<style lang="scss" >
.popper-menu-tree {
  width: 480px;
  box-sizing: border-box;

  .el-input {
    margin-bottom: 10px;
  }

  .el-tree {
  }
}
</style>