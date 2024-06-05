import "./public-path";

import { createApp } from "vue";
import "./assets/styles/tailwind.css";
import Cookies from "js-cookie";
import "@/utils/flexible.js";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import locale from "element-plus/es/locale/lang/zh-cn";

import "@/assets/styles/index.scss";
import GridLayout from "vue3-drr-grid-layout";
import "vue3-drr-grid-layout/dist/style.css";

import App from "./App";
import store from "./store";
import router from "./router";
import directive from "./directive"; // directive
import { qomoPlatformOptions } from "./platform";
import StateComponents from "@/stateComponents";
import QomoPlatform from "@qomo-platform/core";

// 注册指令
import plugins from "./plugins"; // plugins

import {
  renderWithQiankun,
  qiankunWindow
} from "vite-plugin-qiankun/dist/helper";

// svg图标
import "virtual:svg-icons-register";
import elementIcons from "@/components/SvgIcon/svgicon";

import {
  parseTime,
  resetForm,
  addDateRange,
  handleTree,
  selectDictLabel,
  selectDictLabels
} from "@/utils/ruoyi";

// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar";
// 富文本组件
import Editor from "@/components/Editor";
// 文件上传组件
import FileUpload from "@/components/FileUpload";
// 图片上传组件
import ImageUpload from "@/components/ImageUpload";
// 图片预览组件
import ImagePreview from "@/components/ImagePreview";
// 自定义树选择组件
import TreeSelect from "@/components/TreeSelect";
// 字典标签组件
import DictTag from "@/components/DictTag";
import usePermissionStore from "@/store/modules/permission";
import { isHttp } from "@/utils/validate";
import "@/assets/styles/global.css";

let app;

function render(props = {}) {
  const { container } = props;

  app = createApp(App);

  // 全局方法挂载
  app.config.globalProperties.parseTime = parseTime;
  app.config.globalProperties.resetForm = resetForm;
  app.config.globalProperties.handleTree = handleTree;
  app.config.globalProperties.addDateRange = addDateRange;
  app.config.globalProperties.selectDictLabel = selectDictLabel;
  app.config.globalProperties.selectDictLabels = selectDictLabels;

  // 全局组件挂载
  app.component("DictTag", DictTag);
  app.component("Pagination", Pagination);
  app.component("TreeSelect", TreeSelect);
  app.component("FileUpload", FileUpload);
  app.component("ImageUpload", ImageUpload);
  app.component("ImagePreview", ImagePreview);
  app.component("RightToolbar", RightToolbar);
  app.component("Editor", Editor);
  app.use(store);
  usePermissionStore()
    .generateRoutes()
    .then(routes => {
      routes.forEach(route => {
        if (!isHttp(route.path)) {
          router.addRoute(route); // 动态添加可访问路由表
        }
      });
      app.use(router);
      app.use(plugins);
      app.use(elementIcons);
      app.use(GridLayout);
      app.use(StateComponents);
    
      app.use(QomoPlatform, qomoPlatformOptions);
      directive(app);
    
      // 使用element-plus 并且设置全局的大小
      app.use(ElementPlus, {
        locale: locale,
        // 支持 large、default、small
        size: Cookies.get("size") || "default"
      });
    
      app.mount(container ? container.querySelector("#subApp") : "#subApp");
    });


}

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
} else {
  renderWithQiankun({
    mount(props) {
      console.log("===mount===");
      render(props);
    },
    bootstrap() {
      console.log("===bootstrap===");
    },
    unmount(props) {
      console.log(app);
      console.log("===unmount===");
      const { container } = props;
      app.unmount();
    },
    update(props) {
      console.log("===update===", props);
    }
  });
}
