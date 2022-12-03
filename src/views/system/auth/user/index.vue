<template>
  <div class="app-container">
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
            <el-form-item class="bigButton">
              <el-button type="primary" v-hasPerm="['authUserQuery']" @click="handleSearch">搜索</el-button>
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
        size="mini"
      >
        <el-table-column
          prop="loginName"
          label="账号"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="stName"
          label="用户名"
          min-width="150"
          align="center"
        />
        <el-table-column prop="stId" label="用户ID" min-width="150" align="center" />
        <el-table-column
          prop="stPhone"
          label="手机号"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          min-width="160"
          :formatter="gmtCreateFormatTime"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
          align="center"
          min-width="160"
          :formatter="gmtCreateFormatTime"
        >
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" min-width="150">
          <template #default="scope">
            <el-button type="primary" size="small"  @click="changeUser(scope.row)">修改</el-button>
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
    <!--    修改用户信息-->
    <el-dialog v-model="showHide" title="修改用户信息" @close="closeDialog" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px">
        <el-form-item label="账号" prop="loginName" >
          <el-input v-model="temp.loginName" placeholder="请输入账号" disabled style="width: 86%"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="stName" >
          <el-input v-model="temp.stName" placeholder="请输入用户名" disabled style="width: 86%"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="stPhone" >
          <el-input v-model="temp.stPhone" placeholder="请输入手机" style="width: 86%"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId" >
          <el-select v-model="temp.roleId" filterable multiple placeholder="请选择角色" style="width: 86%">
            <el-option
                v-for="item in roleOptions"
                :key="item.code"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showHide = false"> 取消 </el-button>
        <el-button type="success" @click="confirmUser()">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import AvatarUpload from "@/components/avatar-upload";
import { toRefs } from "vue";
import useUser from "./useUser";
export default {
  name: "authUser",
  components: { AvatarUpload },
  setup() {
    const state = useUser();

    state.queryUserList(); // 调用列表方法
    state.getRole(); // 调用获取所有角色的方法

    /*时间格式化*/
    function gmtCreateFormatTime(row, column){
      let  date = row[column.property];
      if(date === undefined || date === null){
        return ''}
      return date.replace("T"," ")
    }

    return {
      ...toRefs(state),
      gmtCreateFormatTime,//过滤器
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
