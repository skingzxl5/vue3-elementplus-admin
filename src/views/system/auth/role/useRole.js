import { reactive, toRefs, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getRoleList, RoleInfoDELETE,saveOrUpdate,findAllUserMenu,granted,custMenusRoleId} from '@/api/user'
import {deepTree} from '@/utils'

export default function(){

    const dataForm = ref(null);
    const state = reactive({
        pagination: {
            pageNo: 1,
            pageSize: 10,
        },
        list: [],
        searchKey: '',
        checkIdList: [],
        dialogTitleMap: {
            update: "角色编辑",
            create: "新增角色",
            quanxian: "角色权限分配",
        },
        dialogStatus: "", // 弹框状态
        roleId: "", // 权限分配id
        menuIds: [], // 权限分配选中的数组
        dialogFormVisible: false,

        dataList: {
            menuList:[],
            menuListSelect:[]
        }, //所有的树形数据
        menuListSelect:[], //选中的树形数据
        temp: {
            id: undefined,
            name: "",
            code: "",
            create_at: undefined,
            menuIdList:[]
        },
        rules: {
            name: [{ required: true, message: "角色名必填", trigger: "blur" }],
            code: [{ required: true, message: "编码必填", trigger: "blur" }],
        },
    })


    // 查询角色列表
    async function queryRoleList() {
        const param = { pageNo: state.pagination.pageNo,pageSize: state.pagination.pageSize,key:state.searchKey}
        await getRoleList(param).then((res) => {
            console.log(res);
            if (res.code == 200){
                const result = {
                    "data": {
                        "pageNo": state.pagination.pageNo,
                        "pageSize": state.pagination.pageSize,
                        "total": res.data.total,
                        "totalPage": state.pagination.pages,
                        "rows":res.data.records,
                    },
                    "code": res.code,
                    "message": res.cnMessage,
                    "result": "SUCCESS"
                }
                const { rows, ...pagination } = result.data;
                state.list = rows;
                state.pagination = pagination;
                state.temp = result.data;
            } 
        });
    }

    /* 渲染菜单列表*/
    const queryMenuList = async () => {
        /* 获取菜单*/
        findAllUserMenu().then((res) => {
            if (res.code == 200) {
                const result = res
                state.dataList.menuList = deepTree(result.data); // 渲染获取的菜单列表数据

            }
        })
    };

    // 重置页码
    const resetPagination = () => {
        state.pagination.pageNo = 1; // 重置页码为第一页
        state.pagination.pageSize = 10; // 重置10条每页
    }

    // 记录选中
    const handleSelectionChange = (val) => {
        let ids = val.map((e) => e.id)
        state.checkIdList = ids;
    }

    // 切换每页条数
    const handleSizeChange = (size) => {
        state.pagination.pageSize = size;
        queryRoleList();
    };

    // 搜索
    const handleSearch = () => {
        resetPagination(); // 重置页码和每页条数
        queryRoleList() // 重新调用获取列表
    }

    // 切换页码
    const handleCurrentChange = (pageNo) => {
        state.pagination.pageNo = pageNo;
        queryRoleList();
    };

    // 刷新
    const refresh = () => {
        queryRoleList();
    };

    // 批量删除
    const handleDestory = () => {
        if (state.checkIdList.length == 0) {
            ElMessage.warning('请选择角色')
            return false
        }
        ElMessageBox.confirm('此操作将永久删除选中数据，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let list = [...state.list];
            state.list = list.filter((e) => !state.checkIdList.includes(e.id))
            console.log(state.list);
            ElMessage.success('删除成功!')
        }).catch(() => {
            console.log('已取消删除');
        })
    };

    // 单个删除
    const handleDelete = (index) => {
        let item = state.list[index];
        ElMessageBox.confirm(`是否删除角色 ${item.name}？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { //删除操作方法
            const param = {id:item.id}
            RoleInfoDELETE(param).then((res) => {
                if (res.code == 200){
                    ElMessage.success(res.data)
                    state.searchKey = '' // 清空搜索项
                    queryRoleList(); // 删除成功之后重新调用列表
                }
            })
        }).catch(() => {
            ElMessage.success('已取消删除')
            // console.log('已取消删除');
        })
    }

    const resetTemp = () => { //新增修改的参数
        state.temp = {
            id: '',
            name: "",
            code: "",
            create_at: '',
            menuIdList: []
        }
    }
    /* 点击新增的方法*/
    const handleCreate = (data) => {
        resetTemp()
        state.dialogStatus = 'create';
        state.dialogFormVisible = true;
    }

    /* 点击编辑的方法*/
    const handleEdit = async (row) => {
        // console.log(row);
        /* 这条数据的回显信息*/
        state.temp.id = row.id;
        state.temp.name = row.name;
        state.temp.code = row.code;
        state.temp.menuIdList = row.menuIdList;

        state.dialogStatus = "update";
        state.dialogFormVisible = true;
    };
    /* 权限分配事件*/
    const authorityManagement = (row) =>{
        state.roleId = row.id // 权限分配的id
        state.dialogStatus = "quanxian";
        /* 分配权限的时候先获取当前权限回显*/
        const param ={roleId:row.id}
        /* 调用获取当前角色拥有的权限*/
        custMenusRoleId(param).then((res) => {
            // state.dataList.menuListSelect = deepTree(res.data); // 渲染获取的菜单列表数据
            console.log(res.data);
            state.dataList.menuListSelect = [2,3,4]; // 渲染获取的菜单列表数据
        })
        state.dialogFormVisible = true;
    }



    /* 点击确定新增的按钮调用新增的方法*/
    const createData = () => {
        /* 调用新增的接口*/
        const param = {
            code: state.temp.code,
            id: "",
            name: state.temp.name,
        }
        saveOrUpdate(param).then((res) => {
            if (res.code == 200){
                ElMessage.success(res.data)
                state.dialogFormVisible = false; // 关闭弹框
                state.searchKey = '' // 清空搜索项
                queryRoleList(); // 删除成功之后重新调用列表
            }
        })
    }

    /* 编辑的方法点击编辑按钮--调用编辑的接口*/
    const updateData = () => {
        /* 编辑的参数*/
        const param = {
            code: state.temp.code,
            id: state.temp.id,
            name: state.temp.name,
        }
        saveOrUpdate(param).then((res) => {
            if (res.code == 200 ){
                ElMessage.success(res.data)
                state.dialogFormVisible = false; // 关闭弹框
                state.searchKey = '' // 清空搜索项
                queryRoleList(); // 删除成功之后重新调用列表
            }
        })
    }

    /* 选中树形权重事件的方法*/
    const geteditAuthorityData = (arr1,arr2) => {
        state.menuIds = arr1.concat(arr2) // 选中的数组
    }
    /* 编辑权限确定事件*/
    const editAuthority = () => {
        const param = {menuIds:state.menuIds,roleId:state.roleId}
        /* 调用分配权限的接口*/
        granted(param).then((res) => {
            if (res.code == 200){
                ElMessage.success(res.cnMessage)
                state.dialogFormVisible = false;
                queryRoleList(); // 执行成功之后重新调用列表
            }else {
                ElMessage.success(res.cnMessage)
            }
        })
    }

    return {
        dataForm,
        ...toRefs(state),
        queryRoleList,
        queryMenuList,
        refresh,
        handleSearch,
        handleSelectionChange,
        handleSizeChange,
        handleCurrentChange,
        handleDestory,
        handleDelete,
        handleCreate,
        handleEdit,
        createData, // 新增事件
        updateData, // 修改事件
        editAuthority, // 编辑权限事件
        geteditAuthorityData, // 获取树形选中的数据
        authorityManagement,// 权限分配事件
    }
}
