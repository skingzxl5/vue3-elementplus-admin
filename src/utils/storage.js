import { isNull } from '@/utils'
const storage = {
    /**
     * 保存数据到 Storage , 将数据转换为 JSON 字符串
     * @param {*} key 键
     * @param {*} value 值
     * @param {*} expired 到期时间
     */
    set(key, value, expired) {
        if (!key) {
            throw 'storage 执行 set 方法，需要参数 key。'
        }
        if (isNull(value)) {
            throw 'storage 执行 set 方法，需要参数 value。'
        }
        let source = {
            key,
            value,
        }
        const now = Date.now()
        if (expired) {
            source.value = JSON.stringify({
                data: value,
                expired: now + 1000 * 60 * expired,
            })
        } else {
            source.value = JSON.stringify({
                data: value,
                expired: 0,
            })
        }
        localStorage.setItem(source.key, source.value)
    },
    /**
     * 获取 Storage 中存储的数据，为空或者过期返回 null
     * @param {*} key 键
     */
    get(key) {
        if (!key) {
            throw 'storage 执行 get 方法，需要参数 key。'
        }
        let source = {
            key,
            value: null,
        }
        const now = Date.now()
        let value = localStorage.getItem(key)
        source.value = value ? JSON.parse(value) : ''
        if (!source.value) {
            return null
        }
        if (now >= source.value.expired && source.value.expired !== 0) {
            this.remove(source.key)
            return null
        }
        return source.value.data
    },
    /**
     * 删除 Storage 中存储的数据
     * @param {*} key
     */
    remove(key) {
        localStorage.removeItem(key)
    },
    /**
     * 清除 Storage 中全部数据
     */
    clear() {
        localStorage.clear()
    },
}

export default storage
