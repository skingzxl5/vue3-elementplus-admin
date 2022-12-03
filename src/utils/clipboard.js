import Clipboard from 'clipboard';
import { ElMessage } from 'element-plus'


export const clipboardSuccess = () => {
    ElMessage({
        showClose: true,
        message: `复制成功`,
        type: 'success'
    });
}

export const  clipboardFail = () => {
    ElMessage({
        showClose: true,
        message: `复制失败`,
        type: 'error'
    });
}

export const handleClipboard = (text, event) => {
    const clipboard = new Clipboard(event.target, {
        text: () => text
    })
    clipboard.on('success', () => {
        clipboardSuccess()
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        clipboardFail()
        clipboard.destroy()
    })
    clipboard.onClick(event);
}