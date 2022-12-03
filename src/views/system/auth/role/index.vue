<template>
  <div class="app-container mydailog">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="custom-table-header-action">
          <el-row>
            <el-form-item>
              <el-input
                  v-model="searchKey"
                  placeholder="请输入关键字"
                  class="table-search-key" style="margin-right: 15px"/>
            </el-form-item>
            <el-form-item class="bigButton" style="margin-right: 15px">
              <el-button type="primary" v-hasPerm="['authRoleQuery']" @click="handleSearch">搜索</el-button>
            </el-form-item>
            <el-form-item class="bigButton">
              <el-button type="primary" @click="handleCreate('create')" v-hasPerm="['authRoleAdd']" >新增</el-button>
            </el-form-item>
          </el-row>
        </div>
      </div>
      <el-table
        :data="list"
        border
        fit
        max-height="700"
        style="width: 100%"
        current-row-key="id"
        @selection-change="handleSelectionChange"

      >
        <el-table-column prop="name" label="角色名" min-width="150" align="center" />
        <el-table-column
          prop="code"
          label="编码"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          align="center"
          min-width="200"
          :formatter="gmtCreateFormatTime"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="280" >
          <template #default="scope">
            <el-button type="primary" size="small" @click="authorityManagement(scope.row)" v-hasPerm="['authRoleEdit']"><el-icon><SetUp /></el-icon>权限分配</el-button>
            <el-button type="primary" size="small" @click="handleEdit(scope.row)" v-hasPerm="['authRoleEdit']"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index)" v-hasPerm="['authRoleDeleted']"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="custom-table-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNo"
          :page-sizes="[10, 15, 20, 40]"
          prev-text="上一页"
          next-text="下一页"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog  width="60%"
      :title="dialogTitleMap[dialogStatus]"
      v-model="dialogFormVisible"
      :close-on-click-modal="false"
      style="width: 90%"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px">
        <el-form-item  v-if="dialogStatus != 'quanxian' " label="角色名" prop="name">
          <el-input v-model="temp.name" placeholder="请填写角色名" style="width: 90%" />
        </el-form-item>
        <el-form-item v-if="dialogStatus != 'quanxian' " label="编码" prop="code">
          <el-input v-model="temp.code" placeholder="请填写编码" style="width: 90%" />
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'quanxian' " label="功能权限" prop="menuIdList">
          <RoleTree v-model:value="temp.menuIdList" :data="dataList" @clickQX="geteditAuthorityData" style="width: 90%;min-height: 500px"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="success"
          @click="dialogStatus === 'create' ? createData() : dialogStatus === 'quanxian' ? editAuthority() : updateData()">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import RoleTree from "@/components/role-tree";
import { toRefs } from "vue";
import useRole from "./useRole";
import moment from "moment";
export default {
  name: "authRole",
  components: { RoleTree },
  setup() {
    const state = useRole();

    state.queryRoleList(); // 查询角色列表
    state.queryMenuList() // 查询按钮数据列表
    /*时间格式化*/
    function gmtCreateFormatTime(row, column){
      let  date = row[column.property];
      if(date === undefined || date === null){
        return ''}
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    }

    return {
      ...toRefs(state),
      gmtCreateFormatTime,// 时间格式化
    };
  },
};
</script>

<style lang="scss" scoped>
.bigButton{
  .el-button {
    width: 150px;
  }
}
</style>
