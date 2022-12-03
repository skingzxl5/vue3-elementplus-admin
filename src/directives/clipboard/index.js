import Clipboard from 'clipboard'

if (!Clipboard) {
    throw new Error('you should npm install `clipboard` --save at first ')
}

let successCallback = null;
let errorCallback = null;
let clipboardInstance = Clipboard;
console.log(clipboardInstance)

const clipboard = {
    beforeMount(el,binding) {
        if (binding.arg === 'success') {
            successCallback = binding.value
        } else if (binding.arg === 'error') {
            errorCallback = binding.value
        } else {
            clipboardInstance = new Clipboard(el, {
                text() { return binding.value },
                action() { return binding.arg === 'cut' ? 'cut' : 'copy' }
            })
            clipboardInstance.on('success', e => {
                const callback = successCallback
                callback && callback(e)
            })
            clipboardInstance.on('error', e => {
                const callback = errorCallback
                callback && callback(e)
            })
        }
    },
    beforeUpdate(el, binding) {
        if (binding.arg === 'success') {
            successCallback = binding.value
        } else if (binding.arg === 'error') {
            errorCallback = binding.value
        } else {
            clipboardInstance = new Clipboard(el, {
                text() { return binding.value },
                action() { return binding.arg === 'cut' ? 'cut' : 'copy' }
            })
        }
    },
    beforeUnmount(_, binding) {
        if (binding.arg === 'success') {
            successCallback = null
        } else if (binding.arg === 'error') {
            errorCallback = null
        } else {
            if (clipboardInstance) {
                clipboardInstance.destroy()
            }
            clipboardInstance = null
        }
    },
    inserted(el, binding, vnode) {
        const {value} = binding
        const all_permission = "*_*";
        //const permissions = store.getters && store.getters.permissions
      const permissions = JSON.parse(window.localStorage.getItem('permission'))
        if (value && value instanceof Array && value.length > 0) {
            const permissionFlag = value

            const hasPermissions = permissions.some(permission => {
                return all_permission === permission || permissionFlag.includes(permission)
            })

            if (!hasPermissions) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`请设置操作权限标签值`)
        }
    }
}


export default clipboard;
