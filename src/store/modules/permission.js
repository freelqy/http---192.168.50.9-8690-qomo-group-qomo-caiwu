import auth from "@/plugins/auth";
import router, { constantRoutes, dynamicRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";
import menu from "@/utils/menu.test";
import { listByApp } from "@/api/menu";
import {
  qiankunWindow
} from "vite-plugin-qiankun/dist/helper";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../../views/**/*.vue");

// const requireComponent = import.meta.glob('@/views', true, /\/index\.vue$/)
// // const requireComponentjeep = require.context('@/jeep/views', true,/^(?!.*JVxeDemo).*\.vue$/)
// const map = new Map([])
// requireComponent.keys().forEach((fileName) => {
//   const componentConfig = requireComponent(fileName)
//   let componentName
//   const _n = fileName.split('/').slice(1, fileName.split('/').length).join('/')
//   if (_n) componentName = _n.replace(/.vue/g, '')
//   else componentName = componentConfig.default.__file
//   map.set(componentName, componentConfig.default || componentConfig)
// })

const usePermissionStore = defineStore("permission", {
  state: () => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  }),
  actions: {
    setRoutes(routes) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes;
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },
    generateRoutes(roles = []) {
      return new Promise(async resolve => {
        //const sdata = JSON.parse(JSON.stringify(res.result))
        let data = [];
        if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
          data = menu;
        } else {
          const menus = await listByApp({
            appId: this.$state.app.id
          });
          data = filterChangeType(menus);
        }
        const sdata = JSON.parse(JSON.stringify(data));
        const rdata = JSON.parse(JSON.stringify(data));
        const defaultData = JSON.parse(JSON.stringify(data));
        const sidebarRoutes = filterAsyncRouter(sdata);
        const rewriteRoutes = filterAsyncRouter(rdata, false, true);
        const defaultRoutes = filterAsyncRouter(defaultData);
        const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
        asyncRoutes.forEach(route => {
          router.addRoute(route);
        });
        this.setRoutes(rewriteRoutes);
        this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
        this.setDefaultRoutes(sidebarRoutes);
        this.setTopbarRoutes(defaultRoutes);
        router.addRoute(rewriteRoutes)
        resolve(rewriteRoutes);
      });
      // const data = menu;
      // const sdata = JSON.parse(JSON.stringify(data));
      // const rdata = JSON.parse(JSON.stringify(data));
      // const defaultData = JSON.parse(JSON.stringify(data));
      // const sidebarRoutes = filterAsyncRouter(sdata);
      // const rewriteRoutes = filterAsyncRouter(rdata, false, true);
      // const defaultRoutes = filterAsyncRouter(defaultData);
      // const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
      // asyncRoutes.forEach(route => {
      //   router.addRoute(route);
      // });
      // this.setRoutes(rewriteRoutes);
      // this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
      // this.setDefaultRoutes(sidebarRoutes);
      // this.setTopbarRoutes(defaultRoutes);
      // resolve(rewriteRoutes);
    }
  },
  persist: true
});

function filterChangeType(routes) {
  function processRoute(route) {
    return {
      component: route.menuType === 0 ? undefined : route.component,
      hidden: route.hidden,
      path: route.url.replace('/layoutApp/caiwu',''),
      name: route.menuType === 0 ? undefined : route.name,
      menuType: route.menuType,
      externalLinks:route.externalLinks,
      redirect: route.url.replace('/layoutApp/caiwu','') + "/" + route.children[0]?.url,
      meta: {
        title: route.name,
        icon: route.icon,
        noCache: route.noCache,
        link: route.link
      },
      children:
        route.children
          ? route.children.map(child => processRoute(child))
          : []
    };
  }

  return routes.map(route => processRoute(route));
}

/**
 * @description: 遍历后台传来的路由字符串，转换为组件对象
 * @param {*} asyncRouterMap
 * @param {*} lastRouter
 * @param {*} type
 * @returns
 */
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        //route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (route.component === "InnerLink") {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView" && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
      if (el.children && el.children.length) {
        children = children.concat(filterChildren(el.children, el));
        return;
      }
    }
    children = children.concat(el);
  });
  return children;
}

/**
 * @description: 遍历动态路由，验证是否具备权限
 * @param {*} routes
 * @returns
 */
export function filterDynamicRoutes(routes) {
  const res = [];
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route);
      }
    }
  });
  return res;
}

export const loadView = view => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  console.log(res)
  return res;
};
// export const loadView = (view) => {
//   if (process.env.NODE_ENV === 'development') {
//     return (resolve) => require([`@/views/latestMonthSch`], resolve)
//   } else {
//     // 使用 import 实现生产环境的路由懒加载
//     return () => import(`@/views/${view}`)
//   }
// }

export default usePermissionStore;
