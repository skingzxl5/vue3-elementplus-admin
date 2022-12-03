<template>
  <div class="role-tree">
    <p>{{ title }}</p>

    <el-input placeholder="输入关键字进行过滤" v-model="keyword" size="small"></el-input>

    <div class="scroller">
      <el-tree
          :default-expand-all="false"
          :data="list"
          :props="props"
          :default-checked-keys="checkedLIst"
          :filter-node-method="filterNode"
          highlight-current
          node-key="id"
          show-checkbox
          ref="tree"
          @check-change="save"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref, watch, toRefs} from 'vue';

export default {
  props: {
    value: Array,
    title: String,
    data: Object,

  },
  setup(props, context) {
    const tree = ref(null)
    const state = reactive({
      list: props.data.menuList,
      checked: [],
      checkedLIst: props.data.menuListSelect,
      keyword: "",
      props: {
        label: "title",
        children: "children"
      },
    })


    const refreshTree = (value) => {
      if (!value) {
        state.checked = []
      }
      let ids = []
      // 处理半选状态
      let fn = (list) => {
        list.forEach(e => {
          if (e.children) {
            fn(e.children);
          } else {
            ids.push(Number(e.id));
          }
        });
      }

      fn(state.list);
      state.checked = ids.filter((id) => (value || []).includes(id));
    }

    const filterNode = (val, data) => {
      if (!val) return true;
      return data.title.includes(val);
    }

    const save = () => {
      const treeRef = tree.value;
      // 选中的节点
      const checked = treeRef.getCheckedKeys();
      // 半选中的节点
      const halfChecked = treeRef.getHalfCheckedKeys();
      context.emit("clickQX", checked, halfChecked);
    }

    watch(() => state.keyword, (value) => {
      tree.value.filter(value)
    })

    watch(() => props.value, (value) => {
      refreshTree(value);
    }, {
      immediate: true
    })

    return {
      tree,
      ...toRefs(state),
      filterNode,
      save
    }
  }
}
</script>

<style lang="scss" scoped>
.scroller {
  border: 1px solid #dcdfe6;
  margin-top: 5px;
  border-radius: 3px;
  height: 450px;
  box-sizing: border-box;
  overflow-x: hidden;
  padding: 5px 0;
}
</style>
