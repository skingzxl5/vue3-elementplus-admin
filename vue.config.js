const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const path = require('path')

let title = process.env.VUE_APP_TITLE

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 9601,
        host: 'localhost',
        https: false,
        // 自动启动浏览器
        open: true,
            // 设置代理proxy
        proxy: {
            '/api': {
                target: 'http://localhost:9223',
                changeOrigin: true,    //表示是否跨域，
                pathRewrite: {           //表示需要rewrite重写的，如果接口地址中就有/api，则不需要重写
                    '^/api': '/api',
                }
            }
        }
    },
    configureWebpack:{
        plugins: [
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    },
    chainWebpack(config) {
        config.plugin('html').tap(args=>{
            args[0].title = title
            return args
        })
        config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
        config.module
            .rule('svg')
            .exclude.add(path.resolve(__dirname, './src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end()
    },
}
