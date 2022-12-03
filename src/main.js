import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { bootstrap } from "./bootstrap";
import "@/styles/base.scss";
import "normalize.css";
import "nprogress/nprogress.css";
// import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/index.css';
import '@/styles/theme-chalk/button.css';
import {userPermissionValue} from "./api/user";
import {ElMessage} from "element-plus";
import {generateDynamicRoutes} from '@/router';
import { useRouter } from "vue-router";
const app = createApp(App);

app.directive("hasPerm",{
  mounted(el, binding, vnode) {
    const {value} = binding

    const all_permission = "*_*";
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
})
/*const router = useRouter();
const routes = await store.dispatch("menu/generateRoutes");
if (!routes) {
  ElMessage.error("该账号没有权限");
} else {
  await generateDynamicRoutes(routes)
  router.push('/');
}

userPermissionValue().then((res) => {

  window.localStorage.setItem( 'permission', JSON.stringify(res.data))

});*/


bootstrap({ app }).then(async ({ router }) => {
  router.isReady().then(() => app.mount("#app"));
});
