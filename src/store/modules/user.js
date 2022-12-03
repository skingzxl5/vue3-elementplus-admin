import { login } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import storage from "@/utils/storage";

const state = () => ({
  token: getToken() || null,
  userInfo: storage.get("userInfo") || {},
});

const mutations = {
  SET_TOKEN(state, token) {
    setToken(token);
    state.token = token;
  },
  SET_USERINFO(state, userInfo) {
    storage.set("userInfo", userInfo);
    state.userInfo = userInfo;
  },
  CLEAR_USER(state) {
    state.userInfo = {};
    storage.remove("userInfo");
  },
  CLEAR_TOKEN(state) {
    state.token = null;
    removeToken();
  },
};

const actions = {
  async login({ commit }, data) {
    return login(data).then((res) => {
      const { data } = res;
      console.log("登录获取用户信息", data);
      commit("SET_TOKEN", data.token);
      commit("SET_USERINFO", data.loginInfo);
      return data;
    });
  },
  logout({ commit }) {
    commit("CLEAR_USER");
    commit("CLEAR_TOKEN");
    commit("menu/CLEAR_MENU_GROUP", null, { root: true });
    commit("menu/CLEAR_VIEW_ROUTES", null, { root: true });
    commit("process/RESET_PROCESS", null, { root: true });
  }
};

export default {
  namespaced: true,
  state: state,
  actions: actions,
  mutations: mutations,
};
