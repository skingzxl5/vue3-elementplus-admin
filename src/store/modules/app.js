import { getToken } from '@/utils/auth';
import { getLocale} from '@/i18n';
import storage from '@/utils/storage'

const state = () => ({
    language: getLocale()
})

const actions = {
    appLoad({dispatch}){
        if (getToken()) {
            dispatch("menu/generateRoutes", null, { root: true });
            dispatch("user/queryUserInfo", null, { root: true });
        }
    },
    setLanguage({ commit }, language) {
        commit('SET_LANGUAGE', language)
    },
}

const mutations = {
    SET_LANGUAGE: (state, language) => {
        state.language = language
        storage.set('language', language)
    },
}

export default {
    namespaced: true,
    state: state,
    actions: actions,
    mutations: mutations
}