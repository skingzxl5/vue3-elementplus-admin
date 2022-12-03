<template>
    <div>
        <el-dropdown
          size="small"
          type="primary"
          trigger="click"
          :hide-on-click="false"
        >
          <el-button type="primary" size="small" icon="el-icon-s-grid"><i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-checkbox-group  v-model="checkedList" @change="handleChange" size="small">
                <el-dropdown-item
                  v-for="(item, index) in list"
                  :key="index"
                  ><el-checkbox :label="item.value">{{
                    item.key
                  }}</el-checkbox></el-dropdown-item
                >
              </el-checkbox-group>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    </div>
</template>

<script>
import {ref} from 'vue'
export default {
    props:{
       list:Array,
       params:Array,
    },
    setup (props,context) {
        
        const checkedList = ref(props.params);

        const handleChange = (value) => {
            context.emit('update:params',value)
        }
        
        return {
            handleChange,
            checkedList
        }
    }
}
</script>

<style lang="scss" scoped>

</style>