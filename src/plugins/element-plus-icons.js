import * as ElIconModules from '@element-plus/icons'

export function loadElementPlusIcons(app){
    for (let key in ElIconModules) {
        app.component(key,ElIconModules[key])
    }
}