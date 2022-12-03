
<h1 align="center">vue3-elementplus-admin</h1>

## 依赖插件/库
```
    "@element-plus/icons": "^0.0.11", # element图标插件
    "axios": "^0.26.1",               # http请求插件
    "clipboard": "^2.0.8",            # 拷贝插件
    "core-js": "^3.8.3",              # JavaScript标准库
    "dayjs": "^1.10.4",               # 处理时间和日期插件
    "echarts": "^5.1.1",              # 可视化图表库
    "element-plus": "^2.1.11",        # UI组件库
    "js-cookie": "^2.2.1",            # cookie相关的插件
    "lodash": "^4.17.21",             # lodash是一套工具库，内部封装了很多字符串、数组、对象等常见数据类型的处理函数
    "moment": "^2.29.3",              # 处理时间和日期格式的库
    "normalize.css": "^8.0.1",        # 基础CS库 
    "nprogress": "^0.2.0",            # 进度条效果插件
    "qs": "^6.10.1",                  # 对象与字符串各种转换，序列化库
    "vue": "^3.2.33",
    "vue-i18n": "^9.1.6",
    "vue-router": "^4.0.14",
    "vuex": "^4.0.2",
    "xe-utils": "^3.5.4"              # 提供了一套实用的基础函数、任意格式的日期转换函数,浏览器相关操作函数等
```

## 目录结构
```
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 项目源码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── directive              # 全局指令
│   ├── icons                  # 项目所有 svg icons
│   ├── i18n                   # 国际化 language
│   ├── layout                 # 全局 layout
│   ├── plugins                # 插件
│   ├── router                 # 路由
│   ├── store                  # 全局 store 管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.js                # 入口文件
│   └── bootstrap.js           # 项目初始化
├── .env.xxx                   # 环境变量配置
├── .eslintrc.js               # eslint 配置项
├── babel.config.js            # babel-loader 配置
├── nodemon.json               # 监听 mock 文件变更自动更新
├── vue.config.js              # vue-cli 配置
└── package.json               # package.json
```

## 实现功能

```
├── 权限管理                       
│   ├── 用户管理   
│   │   ├──查询
│   │   ├──删除
│   │   ├──修改
│   │   ├──分配角色
│   ├── 角色管理   
│   │   ├──新增
│   │   ├──修改
│   │   ├──删除
│   │   ├──分配菜单
│   ├── 菜单管理 
│   │   ├── 新增
│   │   ├── 修改
│   │   ├── 删除 
├── 数据中心               # 什么功能也没有   
├── 首页                   #  简单展示图表
```

## 后端配套



请下载springboot-admin项目，本地运行

## 安装

```bash
# 克隆项目
git clone https://github.com/skingzxl5/vue3-elementplus-admin.git

# 进入项目目录
cd vue3-elementplus-admin

# 安装依赖
yarn

# 本地开发 启动项目
yarn start

# 打包项目
yarn build:prod

```

启动完成后会自动打开浏览器访问 http://localhost:9601/

