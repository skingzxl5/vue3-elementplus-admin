import clipboard from './clipboard'
const directives = {
    clipboard
};

export function loadDirectives(app){
    Object.keys(directives).forEach((key) => {
        app.directive(key, directives[key])
    })
}