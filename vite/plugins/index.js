import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import createAutoImport from "./auto-import";
import createCompression from "./compression";
import createSetupExtend from "./setup-extend";
import qiankun from "vite-plugin-qiankun";
import QomoPlatformPlugin from "@qomo-platform/vite-plugin";

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [
    vue(),
    vueJsx(),
    qiankun("caiwu", {
      useDevMode: true
    })
  ];
  vitePlugins.push(createAutoImport());
  vitePlugins.push(createSetupExtend());
  vitePlugins.push(...QomoPlatformPlugin({
    svgIconPaths:[],
    isBuild
  }));
  isBuild && vitePlugins.push(...createCompression(viteEnv));
  return vitePlugins;
}
