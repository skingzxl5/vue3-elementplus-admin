import { deepTree, revisePath } from "@/utils";
import { userMenu } from "@/api/user";
import storage from "@/utils/storage";

const state = () => ({
  // 菜单列表
  menuGroup: storage.get("menuGroup") || [],
  // 路由列表
  viewRoutes: storage.get("viewRoutes") || [],
  //菜单折叠状态
  collapse: storage.get("collapse") || false,
});

const mutations = {
  SET_MENU_GROUP(state, list) {
    state.menuGroup = list;
    storage.set("menuGroup", list);
  },
  SET_VIEW_ROUTES(state, list) {
    state.viewRoutes = list;
    storage.set("viewRoutes", list);
  },
  SET_COLLASPE(state, value = false) {
    state.collapse = value;
    storage.set("collapse", value);
  },
  CLEAR_MENU_GROUP(state) {
    state.menuGroup = [];
    storage.remove("menuGroup");
  },
  CLEAR_VIEW_ROUTES(state) {
    state.viewRoutes = [];
    storage.remove("viewRoutes");
  },
};

const actions = {
    async generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      userMenu().then((res) => {
        const menus = []
        for(let i=0;i<res.data.length;i++){
          evalDepartment(res.data[i],menus)
        }
        function evalDepartment (department,menus) {
          menus.push(department)
          if (department.children) {
            for (var i = 0; i < department.children.length; i++) {
              evalDepartment(department.children[i],menus)
            }
          }
          return menus;
        }
        const routes = menus
            .filter((e) => e.type !== 2)
            .map((e) => {
              return {
                id: e.id,
                parentId: e.parentId,
                path: revisePath(e.path),
                viewPath: e.viewPath,
                // fix 解决同名节点 导致组件名称相同而产生的页面加载错误
                name: `${e.name}`,
                meta: {
                  keepAlive: e.keepAlive === 1,
                  title: e.title,
                  type: e.type,
                  icon: e.icon,
                  show: true,
                },
                children: [],
              };
            });
        console.log("routes", routes);
        // 格式化菜单
        const menuGroup = deepTree(routes);
        console.log("格式化菜单", menuGroup);
        // 设置菜单组
        commit("SET_MENU_GROUP", menuGroup);
        // 设置视图路由
        const viewRoutes = routes.filter((e) => e.meta.type === 1);
        console.log("设置视图路由", viewRoutes);
        commit("SET_VIEW_ROUTES", viewRoutes);
        resolve(viewRoutes);

      })
    });
  },
  /**
   * 注释API获取，用下面的方法直接返回值res 
  //后端接口参考这个res输出格式 
  async generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      const menus = []
      var res = {
        "code": 0,
        "data": [          
          {
            "id": 1,
            "parentId": 0,
            "type": 1,
            "title": "数据中心",
            "name": "dataCenter",
            "icon": "search",
            "outerFlag": 0,
            "url": null,
            "path": "/dataCenter",
            "keepAlive": 1,
            "viewPath": "views/dataCenter/index.vue",
            "showFlag": 1,
            "permission": null,
            "sort": 1,
            "createStId": null,
            "createTime": null,
            "updateStId": 11867,
            "updateTime": 1659319539000,
            "children": null
          },
          {
            "id": 132,
            "parentId": 0,
            "type": 0,
            "title": "权限管理",
            "name": "",
            "icon": "safetycertificate",
            "outerFlag": 0,
            "url": null,
            "path": null,
            "keepAlive": null,
            "viewPath": null,
            "showFlag": 1,
            "permission": null,
            "sort": 7,
            "createStId": null,
            "createTime": null,
            "updateStId": null,
            "updateTime": null,
            "children": [
              {
                "id": 133,
                "parentId": 132,
                "type": 1,
                "title": "用户管理",
                "name": "authUser",
                "icon": "user-fill",
                "outerFlag": 0,
                "url": null,
                "path": "/system/auth/user",
                "keepAlive": 1,
                "viewPath": "views/system/auth/user/index.vue",
                "showFlag": 1,
                "permission": null,
                "sort": 1,
                "createStId": null,
                "createTime": null,
                "updateStId": null,
                "updateTime": null,
                "children": null
              },
              {
                "id": 135,
                "parentId": 132,
                "type": 1,
                "title": "菜单管理",
                "name": "authMenu",
                "icon": "menu",
                "outerFlag": 0,
                "url": null,
                "path": "/system/auth/menu",
                "keepAlive": 1,
                "viewPath": "views/system/auth/menu/index.vue",
                "showFlag": 1,
                "permission": null,
                "sort": 2,
                "createStId": null,
                "createTime": null,
                "updateStId": null,
                "updateTime": null,
                "children": null
              },
              {
                "id": 140,
                "parentId": 132,
                "type": 1,
                "title": "角色管理",
                "name": "authRole",
                "icon": "customermanagement-fill",
                "outerFlag": 0,
                "url": null,
                "path": "/system/auth/role",
                "keepAlive": 1,
                "viewPath": "views/system/auth/role/index.vue",
                "showFlag": 1,
                "permission": null,
                "sort": 3,
                "createStId": null,
                "createTime": null,
                "updateStId": null,
                "updateTime": null,
                "children": null
              }
            ]
          }
        ],
        "msg": "执行成功"
      }
        for(let i=0;i<res.data.length;i++){
          evalDepartment(res.data[i],menus)
        }
        function evalDepartment (department,menus) {
          menus.push(department)
          if (department.children) {
            for (var i = 0; i < department.children.length; i++) {
              evalDepartment(department.children[i],menus)
            }
          }
          return menus;
        }


        const routes = menus
            .filter((e) => e.type !== 2)
            .map((e) => {
              return {
                id: e.id,
                parentId: e.parentId,
                path: revisePath(e.path),
                viewPath: e.viewPath,
                // fix 解决同名节点 导致组件名称相同而产生的页面加载错误
                name: `${e.name}`,
                meta: {
                  keepAlive: e.keepAlive === 1,
                  title: e.title,
                  type: e.type,
                  icon: e.icon,
                  show: true,
                },
                children: [],
              };
            });
        console.log("routes", routes);
        // 格式化菜单
        const menuGroup = deepTree(routes);
        console.log("格式化菜单", menuGroup);
        // 设置菜单组
        commit("SET_MENU_GROUP", menuGroup);
        // 设置视图路由
        const viewRoutes = routes.filter((e) => e.meta.type === 1);
        console.log("设置视图路由", viewRoutes);
        commit("SET_VIEW_ROUTES", viewRoutes);
        resolve(viewRoutes);



    });
  },
 */
};

export default {
  namespaced: true,
  state: state,
  actions: actions,
  mutations: mutations,
};
