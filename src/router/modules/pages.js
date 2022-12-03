const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/login.vue'),
        meta: {
            title: "登录"
        }
    },
    {
        path: '/401',
        name: '401',
        component: () => import('@/views/error/401.vue'),
        icon: '',
        meta: {
            title: '401',
        }
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: {
            title: '404',
        }
    },
]

export default routes;