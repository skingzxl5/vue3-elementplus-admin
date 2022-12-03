import {variables} from '@/config/theme.config.js'
import storage from '@/utils/storage'
const state = () => ({
    theme: storage.get('theme') || variables.theme,
})

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        switch (key) {
            case 'theme':
                state.theme = value
                break
            default:
                break
        }
        storage.set(key, value)
    },
}

const actions = {
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
    },
}

export default {
    namespaced: true,
    state: state,
    actions: actions,
    mutations: mutations,
}
