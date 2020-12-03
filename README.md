# major-events

> A Vue.js project

## Build Setup

``` bash
1.svn下载前端代码

2.下载安装node，默认安置即可
http://nodejs.cn/download/

3.安装项目依赖，项目根目录cmd运行
  npm install
  
4.启动项目，项目根目录cmd运行
  npm run dev

# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## ol-map
地图组件 `src\components\ol-map\index.vue` 的地图相关操作逻辑放在`src\components\ol-map\bundles\`文件夹下。

    地图创建和数据渲染分离。
    地图创建时，决定数据渲染逻辑。程序运行过程中，地图渲染逻辑不变，数据变动，同时数据变动自动反映在地图上。
    渲染逻辑和数据逻辑分离，提升开发和维护效率。
