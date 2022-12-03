<template>
    <el-dialog title="快速输入" v-model="dialogVisible" @close="closeOnClick" width="30%">
        <el-row :gutter="24">
            <el-col>
                <el-input v-model="batchHawCode" type="textarea" :rows="20" />
            </el-col>
        </el-row>
        <template #footer>
            <div>
                <el-button type="primary" @click="affirmOnClick">
                    确定
                </el-button>
                <el-button type="success" @click="closeOnClick">
                    取消
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
    emits: [
        'detailCloseClick',
        'detailAffirmClick'
    ],
    props: {
        dialogFormVisible: {
            type: Boolean,
            required: true
        }
    },
    watch: {
        dialogFormVisible(newValue) {
            this.dialogVisible = newValue;
        }
    },
    setup(props, { emit }) {
        const state = reactive({
            batchHawCode: '',
            dialogVisible: false
        })
        const closeOnClick = () => {
            emit('detailCloseClick')
        }
        const affirmOnClick = () => {
            const str = state.batchHawCode.replace(/\n|\r\n/g, ",")
            emit('detailAffirmClick', str)
        }
        return {
            ...toRefs(state),
            closeOnClick,
            affirmOnClick
        };
    },
};
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>