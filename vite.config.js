import { defineConfig, loadEnv } from "vite";
import path from "path";
import createVitePlugins from "./vite/plugins";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
const { networkInterfaces } = require("os");

/** 获取本地IP地址 */
function getLocalIpAddress() {
  const interfaces = networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    for (const interfaceInfo of interfaces[interfaceName]) {
      if (!interfaceInfo.internal && interfaceInfo.family === "IPv4") {
        return interfaceInfo.address;
      }
    }
  }
  return "localhost"; // 如果没有找到非内部的 IPv4 地址，则返回 localhost
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ENV } = env;
  const aliasPath =
  VITE_APP_ENV === "production"
    ? {}
    : {
        "@qomo-platform/layout/src": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-layout/src"
        ),
        "@qomo-platform/layout": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-layout/src"
        ),
        "@qomo-platform/component/src": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-component/src"
        ),
        "@qomo-platform/component": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-component/src"
        ),
        "@qomo-platform/core/src": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-platform/src"
        ),
        "@qomo-platform/core": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-platform/src"
        ),
        "@qomo-platform/hooks/src": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-hooks/src"
        ),
        "@qomo-platform/hooks": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-hooks/src"
        ),
        "@qomo-platform/utils/src": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-utils/src"
        ),
        "@qomo-platform/utils": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-utils/src"
        ),
        "@qomo-platform/dict/src": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-dict/src"
        ),
        "@qomo-platform/dict": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-dict/src"
        ),
        "@qomo-platform/vite-plugin": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-vite-plugin/src"
        ),
        "@qomo-platform/vite-plugin/src": path.resolve(
          __dirname,
          "D:/works/qomo-platform/packages/qomo-vite-plugin/src"
        ),
      };
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === "production" ? "/layoutApp/caiwu/" : "/",
    plugins: createVitePlugins(env, command === "build"),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        "~": path.resolve(__dirname, "./"),
        // 设置别名
        "@": path.resolve(__dirname, "./src"),
        ...aliasPath
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
      // 配置跨域请求头，解决开发环境的跨域问题

    },
    // vite 相关配置
    server: {
      port: 8082,
      // 关闭主机检查，使微应用可以被 fetch
      disableHostCheck: true,
      host: getLocalIpAddress(),
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        "/qomo": {
          // target: "http://192.168.50.9:8089",
          /// target: "http://192.168.50.244:8095",
          target: "http://192.168.50.9:8095",
          changeOrigin: true,
          pathRewrite: {
            "^/qomo": "/qomo"
          }
        },
      },
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    },

    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: atRule => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              }
            }
          },
          require("postcss-pxtorem")({
            rootValue: 144, // 根字体大小
            unitPrecision: 5,
            propList: ["*"],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false
            //exclude: /node_modules/i
          }),
          // require("postcss-plugin-px2vw")({
          //   unitToConvert: "px",
          //   viewportWidth: 1440, // 视窗宽度，如 iPhone 6 为 750px
          //   unitPrecision: 5,
          //   viewportUnit: "vw",
          //   selectorBlackList: [],
          //   minPixelValue:window.devicePixelRatio,
          // }),
        ]
      }
    }
  };
});
