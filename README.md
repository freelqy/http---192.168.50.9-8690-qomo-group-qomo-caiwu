### QoMoAi 公共层前端子应用代码

#### 注意事项

1. 修改 **vite.config.js** 文件
   > flow-graph 要与package 中的name保持一致
   > 并且与主应用 MicroConfig数组中应用的 name保持一致 MicroConfig在主应用src/module/app.js
   >
   > MicroConfig 配置如下
   >
   > ```javascript
   > const VITE_APP_ENV = import.meta.env.VITE_APP_ENV;
   > // 开发时 entry 换成自己ip即可
   > const MicroConfig = [
   >   {
   >     name: "flow-graph",
   >     entry:
   >       VITE_APP_ENV === "production"
   >         ? "/flow-graph/"
   >         : "//192.168.50.154:8081",
   >     container: "#subApp",
   >     activeRule: "/flow-graph",
   >     props: {
   >       store
   >     }
   >   }
   > ];
   > ```
   >
   > **vite.config.js** 配置如下
   >
   > ```javascript
   > base: VITE_APP_ENV === "production" ? "/flow-graph/" : " ";
   > ```
2. 修改 **route.js** 文件
   > ```javascript
   > // 同上， 开发环境可配置可不配
   > history: createWebHistory(`/flow-graph/`);
   > ```
3. 修改Nginx配置
   > ```shell
   >       location /flow-graph {
   >            alias       /data/CommonLayer/microApp/child/dist;
   >            try_files   $uri $uri/ /CommonLayer/microApp/child/index.html;
   >            add_header  Access-Control-Allow-Origin *;
   >        }
   > ```

#### 代码提交

- 代码暂存 `git add .`
- 代码提交 `pnpm commit` 必须执行此命令提交代码，否则无法通过校验
- 代码推送 `git push`

#### 代码目录结构

```
├── public
│   ├── favicon.ico
├── src
│   ├── assets  // 静态文件目录
│   │   ├── images
│   │   └── styles
│   ├── components  // 公共组件目录
│   │   └── ...
│   ├── layouts  // 布局组件目录
│   │   └── ...
│   ├── directive    // 自定义指令目录
│   │   ├── index.js
│   │   └── ...
│   ├── plugins // 插件目录
│   │   ├── index.js
│   │   └── ...
│   ├── hooks  // 自定义hooks目录
│   │   ├── useRequest.js
│   │   └── ...
│   ├── pages // 公共页面目录
│   │   └── ...
│   ├── views // 视图目录
│   │   └── ...
│   ├── utils
│   │   ├── index.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   ├── routes.js
│   └── ...
├── .env
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── package.json
├── README.md
└── ...
```
