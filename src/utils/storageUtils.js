import store from 'store'
export default {
    /**
     * 存储localStorage
     */
    setStore(key, value) {
        store.set(key, value)
    },

    /**
     * 获取localStorage
     */
    getStore(key) {
        return store.get(key) || {}
    },
    /**
     * 删除localStorage
     */
    removeStore(key) {
        store.remove(key)
    }
}
