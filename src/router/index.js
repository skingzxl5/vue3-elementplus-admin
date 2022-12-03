import { createRouter, createWebHistory } from 'vue-router';
import routes from "./modules/pages";
import views from './modules/views';
import { toRaw } from 'vue'


export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes,
  strict: true,
})

// 挂载路由
export function loadRouter(app) {
  app.use(router);
  return router;
}

export function useRouter() {
  return router;
}

// 加载路由
export async function loadRoutes({store}){
  let viewRoutes = toRaw(store.state.menu.viewRoutes);
  if (!viewRoutes) {
    viewRoutes = await store.dispatch("menu/generateRoutes");
    generateDynamicRoutes(viewRoutes)
  } else {
    generateDynamicRoutes(viewRoutes)
  }
}

// 动态添加路由
export function generateDynamicRoutes(list){
  list = list.map((item)=>{
    return {
      ...item,
      component: () => import(`@/${item.viewPath}`)
    }
  })

  views.children = views.children.concat(list);
  console.log(list)
  router.addRoute(views);
  // 在动态路由添加后，在将404添加进入，解决刷新是找不到路由跳转404
  router.addRoute({
    path: '/:pathMatch(.*)',
    redirect: '/404'
  })
}
