<template>
  <div class="app-container">
    <div class="app-body">
      <div class="custom-table-header">
        <div class="custom-table-header-action">
          <el-row>
            <el-form-item class="bigButton" style="margin-right: 20px">
              <el-button type="primary" v-hasPerm="['authMenuQuery']" @click="refresh">刷新</el-button>
            </el-form-item>
            <el-form-item  class="bigButton">
              <el-button type="primary" v-hasPerm="['authMenuAdd']"  @click="handleCreate">新增</el-button>
            </el-form-item>
          </el-row>
        </div>
      </div>

      <el-table
        :data="list"
        row-key="id"
        border
        style="height: 100%"
        default-expand-all
        :tree-props="{ children: 'children' }"
        size="mini"
      >
        <el-table-column prop="title" label="标题" align="left" min-width="160" />
        <el-table-column prop="name" label="名称" align="center" min-width="160" />
        <el-table-column prop="icon" label="图标" align="center" min-width="80">
          <template #default="scope">
            <icon-svg :name="scope.row.icon" v-if="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" align="center" min-width="80">
          <template #default="scope">
            <el-tag effect="dark">{{ typeOptions[scope.row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="path"
          label="路由路径"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="permission"
          label="权限值"
          align="center"
          min-width="160"
        />
        <el-table-column
          prop="sort"
          label="值排序"
          align="center"
          min-width="80"
        />
        <el-table-column
          prop="showFlag"
          label="是否显示"
          align="center"
          min-width="80">
          <template #default="scope">
            {{ scope.row.showFlag == 0 ? '否': scope.row.showFlag == 1 ? '是':'' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="keepAlive"
          label="路由缓存"
          align="center"
          min-width="80"
        >
          <template #default="scope">
            {{ scope.row.keepAlive == 0 ? '否': scope.row.keepAlive == 1 ? '是':'' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="viewPath"
          label="文件路径"
          align="center"
          show-overflow-tooltip
          min-width="160"
        />
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
          min-width="160"
          :formatter="gmtCreateFormatTime"
        />
        <el-table-column label="操作" fixed="right" align="center" min-width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)"  v-hasPerm="['authMenuEdit']"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)" v-hasPerm="['authMenuDeleted']"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      v-model="dialogFormVisible"
      :close-on-click-modal="false"
      style="width: 960px"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="100px">
        <el-form-item label="节点类型" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="节点标题" prop="title" required>
          <el-input v-model="temp.title" placeholder="请输入节点标题" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="节点名称" prop="name" v-if="temp.type == 1">
          <el-input v-model="temp.name" placeholder="请输入节点名称" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="上级节点" prop="parentId">
          <MenuTree v-model:value="temp.parentId" :menuList="menuList" style="width: 80%" />
        </el-form-item>
        <el-form-item label="节点路由" prop="router" v-if="temp.type == 1">
          <el-input v-model="temp.router" placeholder="请输入节点路由" style="width: 80%" />
        </el-form-item>
        <el-form-item label="路由缓存" prop="keepAlive" v-if="temp.type == 1">
          <el-radio-group v-model="temp.keepAlive">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="isShow" label="是否显示"  v-if="temp.type != 2">
          <el-radio-group v-model="temp.isShow">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="permission" label="按钮权限值"  v-if="temp.type == 2">
          <el-input v-model="temp.permission" placeholder="请输入按钮权限值" style="width: 80%" />
        </el-form-item>
        <el-form-item prop="sort" label="排序值"  v-if="temp.type == 1">
          <el-input-number v-model="temp.sort" controls-position="right"  style="width: 80%"></el-input-number>
        </el-form-item>
        <el-form-item label="文件路径" prop="viewPath" v-if="temp.type == 1">
          <MenuFilePath v-model:value="temp.viewPath" placeholder="请选择" style="width: 80%" />
        </el-form-item>
        <el-form-item prop="icon" label="节点图标"  v-if="temp.type != 2">
          <MenuIcons v-model:value="temp.icon" style="width: 80%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="success"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { getMenuList ,sysCustMenuSaveOrUpdate,sysCustMenuDelete} from "@/api/user";
import { deepTree } from "@/utils";
import _ from "lodash";
import MenuTree from "@/components/menu-tree";
import MenuIcons from "@/components/menu-icons";
import MenuFilePath from "@/components/menu-file-path";
import moment from "moment";

export default {
  name: "authMenu",
  components: { MenuTree, MenuIcons, MenuFilePath },
  setup() {
    const dataForm = ref(null);
    const state = reactive({
      menuList: [],
      list: [], // 表格列表数据
      typeOptions: {
        0: "目录",
        1: "菜单",
        2: "按钮",
      },
      dialogFormVisible: false,
      dialogTitleMap: {
        update: "编辑",
        create: "新增",
      },
      dialogStatus: "",
      temp: {
        type: 0, // 节点类型
        title:"",//节点标题
        name: "", // 节点名称
        parentId: 0, // 上级节点
        isShow: true, // 是否显示
        permission: '', // 按钮权限值
        sort: '', // 排序值
        icon: "", // 节点图标
        router: "", // 节点路由
        keepAlive: 1, // 路由缓存开启/关闭1
        viewPath: "", // 文件路径
      },
      rules: {
        title: [{ required: true, message: "节点标题必填", trigger: "blur" }],
        permission: [{ required: true, message: "按钮权限值必填", trigger: "blur" }],
        sort: [{ required: true, message: "排序值值必填", trigger: "blur" }],
      },
    });

    const refresh = () => {
      queryMenuList(); // 获取菜单按钮权限数据列表
    };

    const queryMenuList = async () => {
      /* 接口获取菜单按钮权限列表数据-----然后渲染成树形*/
      await getMenuList().then((res) => {
        if (res.code == 200){
          const result = {
            data: res.data,
            code: res.code,
            message: res.cnMessage,
            result: res.cnMessage,
          }
          state.menuList = _.cloneDeep(result.data);
          state.list = deepTree(result.data);
        }
      })
    };

    /*时间格式化*/
    function gmtCreateFormatTime(row, column){
      let  date = row[column.property];
      if(date === undefined || date === null){
        return ''}
      return moment(date).format("YYYY-MM-DD HH:mm:ss")
    }

    const resetTemp = () => {
      state.temp = {
        type: 0, // 节点类型
        title: "", // 节点标题
        name: "", // 节点名称字段
        parentId: 0, // 上级节点
        isShow: true, // 是否显示
        permission: '', // 按钮权限值
        icon: "", // 节点图标
        router: "", // 节点路由
        keepAlive: 1, // 路由缓存开启/关闭1
        viewPath: "", // 文件路径
      };
    };

    /* 点击新增菜单的按钮事件 ----- 打开弹框输入信息进行新增*/
    const handleCreate = () => {
      resetTemp();
      state.dialogStatus = "create";
      state.dialogFormVisible = true;
    };

    const handleEdit = (row) => {
      state.temp = Object.assign({}, row);
      state.dialogStatus = "update";
      state.dialogFormVisible = true;
    };

    /* 点击 确定新增 按钮的时候---创建确认新增的事件*/
    const createData = () => {
      if (state.temp.title == ''){
        ElMessage({
          message: '节点标题不能为空',
          type: 'warning',
        })
        return false
      }
      sysCustMenuSaveOrUpdate(state.temp).then((res) => {
        if (res.code == 200){
          state.dialogFormVisible = false; // 关闭弹框
          ElMessage.success('创建成功!')
          refresh(); // 刷新列表
        }
      })
    };

    /* 点击编辑事件的确定按钮的时候*/
    const updateData = () => {
      sysCustMenuSaveOrUpdate(state.temp).then((res) => {
        if (res.code == 200){
          state.dialogFormVisible = false; // 关闭弹框
          ElMessage.success('编辑成功!')
          refresh(); // 刷新列表
        }
      })
    };

    /* 点击删除---删除事件  */
    const handleDelete = (row) => {
      ElMessageBox.confirm(`是否删除 ${row.name}？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          /* 删除菜单的方法*/
          const param = {id:row.id}
          sysCustMenuDelete(param).then((res) => {
            if (res.code == 200){
              state.dialogFormVisible = false; // 关闭弹框
              ElMessage.success("删除成功!");
              refresh(); // 刷新列表
            }
          })
        })
        .catch(() => {
          console.log("已取消删除");
        });
    };

    refresh(); // 最初获取列表

    return {
      dataForm,
      ...toRefs(state),
      refresh,
      getMenuList,
      sysCustMenuSaveOrUpdate, // 新增和修改菜单按钮的方法
      sysCustMenuDelete, // 删除菜单按钮的方法
      handleCreate,
      handleEdit,
      gmtCreateFormatTime,
      createData,
      updateData,
      handleDelete, // 删除的事件
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
