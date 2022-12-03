import { defineAsyncComponent } from 'vue'
// 加载全局组件
export function loadComponents(app) {
    app.component("Scroll", defineAsyncComponent({
        loader: () => import("./scroll/index.vue")
    }));
    app.component("IconSvg", defineAsyncComponent({
        loader: () => import("./icon-svg/index.vue")
    }));
    app.component("FilterSwitch",defineAsyncComponent({
        loader:()=>import('./filter-switch/index.vue')
    }))
    app.component("ParamSelector", defineAsyncComponent({
        loader: () => import('./param-selector/index.vue')
    }))
}