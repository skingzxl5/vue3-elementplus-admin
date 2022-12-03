import {reactive, toRefs, ref} from 'vue'
import {getUserList, getRoleListAll, saveOrUpdateUsers} from '@/api/user';
import {ElMessage} from 'element-plus'


export default function () {
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
            update: "编辑",
            create: "新增",
        },
        dialogStatus: "",
        dialogFormVisible: false,

        temp: {
            stId: '',
            stName: '', // 用户名
            stEname: '', 
            stPhone: '', // 手机
            loginName: '', // 账号
            loginPassword: '', // 机构id
            createStId:'',
            machineCode:'',
            createTime:'',
            updateTime:'',
            deleteFlag:0,
            roleId: [] // 角色
        },
        roleList: {}, // 角色数据
        showHide: false,
        roleOptions:[], // 角色数据
        roleIdHX: [], // 角色回显
    })

    /* 获取所有角色---机构*/
    async function getRole(){
        /* 调用获取角色接口*/
        await getRoleListAll().then((res) => {
            state.roleOptions = res.data
        })
    }

    // 查询用户
    async function queryUserList() {
        /* 查询用户列表的接口*/
        const param = {pageNo: state.pagination.pageNo, pageSize: state.pagination.pageSize, key: state.searchKey}
        // 获取用户列表数据
        await getUserList(param).then((res) => { 
            // console.log(res);
            if (res.code == 200) {
                const result = {
                    "data": {
                        "pageNo": state.pagination.pageNo,
                        "pageSize": state.pagination.pageSize,
                        "total": res.data.total,
                        "totalPage": state.pagination.pageNo,
                        "rows": res.data.records,
                    },
                    "code": res.code,
                    "message": res.msg,
                    "result": "SUCCESS"
                }
                const {rows, ...pagination} = result.data;
                state.list = rows;
                state.pagination = pagination;
            }
        })
    }

    // 重置页码
    const resetPagination = () => {
        state.pagination.pageNo = 1;
    }

    // 记录选中
    const handleSelectionChange = (val) => {
        let ids = val.map((e) => e.id)
        state.checkIdList = ids;
    }

    // 切换每页条数
    const handleSizeChange = (size) => {
        state.pagination.pageSize = size;
        queryUserList();
    };

    // 切换页码
    const handleCurrentChange = (pageNo) => {
        state.pagination.pageNo = pageNo;
        queryUserList();
    };

    // 搜索
    const handleSearch = () => {
        resetPagination();
        queryUserList()
    }

    // 刷新
    const refresh = () => {
        state.pagination.pageNo = 1; // 刷新的时候页码置为1
        state.pagination.pageSize = 10; // 刷新的时候设置每页条数10条
        queryUserList();
    };
    /* 修改事件*/
    const changeUser = (row) => {
        state.roleIdHX = []
        for (var i=0;i<row.roles.length;i++){
            state.roleIdHX.push(row.roles[i].id)
        }
        state.temp = {
            "stId": row.stId, // id
            "stName": row.stName,
            "stEname": row.stEname,
            "stPhone": row.stPhone,
            "loginName": row.loginName,
            "loginPassword": row.loginPassword,
            "createStId": row.createStId,
            "machineCode":row.machineCode,
            "createTime": row.createTime,
            "updateTime": row.updateTime,
            "deleteFlag": row.deleteFlag,
            "roleId": state.roleIdHX // 角色
        }
        state.showHide = true // 打开弹框
    }
    /*关闭修改事件*/
    const closeDialog = () => {
        state.showHide = false // 关闭弹框
    }
    /* 修改框点击确定事件*/
    const confirmUser = () => {
        const param = {
            "stId": state.temp.stId, // id
            "stName": state.temp.stName,
            "stEname": state.temp.stEname,
            "stPhone": state.temp.stPhone,
            "loginName": state.temp.loginName,
            "loginPassword": state.temp.loginPassword,
            "createStId": state.temp.createStId,
            "machineCode":state.temp.machineCode,
            "createTime": state.temp.createTime,
            "updateTime": state.temp.updateTime,
            "deleteFlag": state.temp.deleteFlag,
            "roleId": state.temp.roleId.toString() // 角色
        }
        saveOrUpdateUsers(param).then((res) => {
            if (res.code == 200) {
                ElMessage.success(res.cnMessage)
                state.showHide = false // 关闭弹框
                queryUserList();
            }else {
                ElMessage.error(res.cnMessage)
            }
        })
    }

    return {
        ...toRefs(state),
        dataForm,
        queryUserList, // 获取用户列表
        getRole, // 获取所有角色
        refresh,
        handleSearch,
        handleSelectionChange,
        handleSizeChange,
        handleCurrentChange,
        changeUser, // 修改事件
        closeDialog, // 关闭修改事件
        confirmUser, // 修改确定按钮事件
    }
}
