import { toRaw } from 'vue'
export default {
    // 用户token
    token: (state) => state.user.token,
    // 语言
    language: (state) => state.app.language,
    // 用户信息
    userInfo: (state) => state.user.userInfo,
    // 菜单列表
    menuGroup: (state) => toRaw(state.menu.menuGroup),
    // 路由列表
    viewRoutes: (state) => toRaw(state.menu.viewRoutes),
    // 菜单是否展开
    menuCollapse: (state) => state.menu.collapse,
    // 窗口列表
    processList: (state) => state.process.list,
}