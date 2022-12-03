import {reactive, toRefs} from 'vue'
import {formatDate} from '@/utils/date'

const none = () => {
}
export default function ({queryFn = none}) {
    let state = reactive({
        pagination: {
            current: 1,
            pages: 0,
            size: 10,
            total: 0,
        },
        checkIdList: [],
    })

    // 记录选中
    const handleSelectionChange = (val) => {
        let ids = val.map((e) => e.id)
        state.checkIdList = ids;
    }

    // 重置页码
    const resetPagination = () => {
        state.pagination.current = 1
    }

    // 切换每页条数
    const handleSizeChange = (size) => {
        state.pagination.size = size
        queryFn && queryFn()
    }

    // 切换页码
    const handleCurrentChange = (pageNo) => {
        state.pagination.current = pageNo
        queryFn && queryFn()
    }

    // 搜索
    const handleSearch = () => {
        resetPagination()
        queryFn && queryFn()
    }

    // 刷新
    const refresh = () => {
        queryFn && queryFn()
    }

    // 格式化时间
    const formatter = (row, field) => {
        return formatDate(row[field])
    }


    return {
        ...toRefs(state),
        refresh,
        handleSearch,
        handleCurrentChange,
        handleSizeChange,
        handleSelectionChange,
        formatter,
    }
}
