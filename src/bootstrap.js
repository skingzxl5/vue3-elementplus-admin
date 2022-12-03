
import { loadRouter } from '@/router';
import { loadStore } from '@/store';
import { loadGuards } from '@/router/guards';
import { loadRoutes} from '@/router';
import { loadComponents } from '@/components';
import { loadSvg } from '@/icons';
import { loadDirectives } from '@/directives';
import { loadI18n } from '@/i18n'
import {loadElementPlusIcons} from '@/plugins/element-plus-icons'
import ElementPlus from "element-plus";


export async function bootstrap(options){
    const { app} = options;


    const store = loadStore(app)
    const router = loadRouter(app)

    app.use(ElementPlus)
    loadElementPlusIcons(app)
    loadI18n(app)
    loadComponents(app)
    loadSvg()
    loadDirectives(app)

    await loadRoutes({ store})
    await loadGuards(router);

    return { router}
}