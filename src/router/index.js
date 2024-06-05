import { createWebHistory, createRouter } from "vue-router";
/* Layout */
import Layout from "@/layout";
import NProgress from "nprogress";
import usePermissionStore from "@/store/modules/permission";
import { isHttp } from "@/utils/validate";
import { getToken } from "@/utils/auth";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/pages/redirect/index.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/pages/Login"),
    hidden: true
  },
  {
    path: "/register",
    component: () => import("@/pages/Register"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/pages/error/401"),
    hidden: true
  },
  {
    path: "",
    redirect: "/index"
  },
  // {
  //   path: "/index",
  //   component: () => import("@/pages/Main"),
  //   hidden: true
  // },
  {
    path: "",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        component: () => import("@/views/index"),
        name: "Index",
        meta: { title: "首页", icon: "home", affix: true }
      }
    ]
  }

  // {
  //   path: "/flow-graph/:chapters*"
  // },
];

//本地调试默认路由
const defaultRoutes = [
  //最新月度计划表
  {
    path: "/latestMonthSch",
    name: "latestMonthSch",
    component: () => import("@/views/latestMonthSch")
  },
  {
    path: "/bb/latestMonthSch",
    name: "bbLatestMonthSch",
    component: () => import("@/views/latestMonthSch")
  },
  //板块预测毛利率
  {
    path: "/grossProfit",
    name: "grossProfit",
    component: () => import("@/views/grossProfit")
  },
  //项目投标毛利率
  {
    path: "/projectBidGrossMargin",
    name: "projectBidGrossMargin",
    component: () => import("@/views/projectBidGrossMargin")
  },
  //项目累计毛利率
  {
    path: "/projectGross",
    name: "projectGross",
    component: () => import("@/views/projectGross")
  },
  //营业总成本
  {
    path: "/totalOperatingCost",
    name: "totalOperatingCost",
    component: () => import("@/views/totalOperatingCost")
  },
  //营业总收入
  {
    path: "/totalOperatingIncome",
    name: "totalOperatingIncome",
    component: () => import("@/views/totalOperatingIncome")
  },
  {
    path: "/costForecast",
    name: "costForecast",
    component: () => import("@/views/costForecast")
  },
  {
    path: "/monthlyProfit",
    name: "monthlyProfit",
    component: () => import("@/views/monthlyProfit")
  },
  {
    path: "/lr/monthlyProfitDesc/:id",
    name: "monthlyProfitDesc",
    component: () => import("@/views/monthlyProfit/monthlyProfitDesc")
  },
  //汇总利润分析
  {
    path: "/sumProfit",
    name: "sumProfit",
    component: () => import("@/views/sumProfit")
  },
  {
    path: "/lr/sumProfitDesc/:id",
    name: "sumProfitDesc",
    component: () => import("@/views/sumProfit/sumProfitDesc")
  },

  //利润偏差分析
  {
    path: "/profitDeviationAnalysis",
    name: "profitDeviationAnalysis",
    component: () => import("@/views/profitDeviationAnalysis")
  },
  {
    path: "/lr/profitDeviationAnalysisDesc/:id",
    name: "profitDeviationAnalysisDesc",
    component: () =>
      import("@/views/profitDeviationAnalysis/profitDeviationAnalysisDesc")
  },

  //应收逾期账龄-实际-
  {
    path: "/receivableAgeActual",
    name: "receivableAgeActual",
    component: () => import("@/views/receivableAgeActual")
  },
  {
    path: "/lr/receivableAgeActualDesc",
    name: "receivableAgeActualDesc",
    component: () =>
      import("@/views/receivableAgeActual/receivableAgeActualDesc")
  },

  //应收逾期账龄-預計-
  {
    path: "/receivableAgeExpect",
    name: "receivableAgeExpect",
    component: () => import("@/views/receivableAgeExpect")
  },
  //应收账款坏账计提
  {
    path: "/badDebtProvision",
    name: "badDebtProvision",
    component: () => import("@/views/badDebtProvision")
  }
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [...defaultRoutes];

const router = createRouter({
  history: createWebHistory(`/layoutApp/caiwu/`),
  routes: [...constantRoutes, ...dynamicRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

const whiteList = ["/login", "/register"];
let isAddRoute = false;
NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  next();
  // NProgress.start();
  // if (getToken()) {
  //   if (to.path === "/login") {
  //     next({ path: "/" });
  //     NProgress.done();
  //   } else if (whiteList.indexOf(to.path) !== -1) {
  //     next();
  //   } else {
  //     if (!isAddRoute) {
  //       isAddRoute = true;
  //       usePermissionStore()
  //         .generateRoutes()
  //         .then(routes => {
  //           routes.forEach(route => {
  //             if (!isHttp(route.path) && !router.hasRoute(route.name)) {
  //               router.addRoute(route); // 动态添加可访问路由表
  //             }
  //           });
  //           next({ ...to, replace: true });
  //         });
  //     } else {
  //       next();
  //     }
  //   }
  // } else {
  //   // 没有token
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // 在免登录白名单，直接进入
  //     next();
  //   } else {
  //     next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
  //     NProgress.done();
  //   }
  // }
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
