<template>
  <div
    :class="classObj"
    :style="{ '--current-color': theme }"
    class="app-wrapper"
    v-if="!isQIANKUN"
  >
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar v-if="!sidebar.hide" class="sidebar-container" />
    <div :class="{ 'fixed-header': fixedHeader }">
      <navbar @setLayout="setLayout" />
      <div class="tags-view-container-box">
        <tags-view v-if="needTagsView" />
      </div>
    </div>
    <div
      :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }"
      class="main-container"
    >
      <app-main />
      <settings ref="settingRef" />
    </div>
  </div>
  <app-main v-else />
</template>

<script setup>
import { useWindowSize } from "@vueuse/core";
import Sidebar from "./components/Sidebar/index.vue";
import { AppMain, Navbar, Settings, TagsView } from "./components";

import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme);
const sideTheme = computed(() => settingsStore.sideTheme);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === "mobile"
}));

const { width, height } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design
const isQIANKUN = computed(() => qiankunWindow.__POWERED_BY_QIANKUN__);
watchEffect(() => {
  if (device.value === "mobile" && sidebar.value.opened) {
    useAppStore().closeSideBar({ withoutAnimation: false });
  }
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice("mobile");
    useAppStore().closeSideBar({ withoutAnimation: true });
  } else {
    useAppStore().toggleDevice("desktop");
  }
});

function handleClickOutside() {
  useAppStore().closeSideBar({ withoutAnimation: false });
}

const settingRef = ref(null);
function setLayout() {
  settingRef.value.openSetting();
}
</script>

<!-- <style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
.hideSidebar .tags-view-container-box {
  width: calc(100% - 54px);
  margin-left: 54px;
}

.tags-view-container-box {
  width: calc(100% - 200px);
  margin-left: #{$base-sidebar-width};
  transition: margin-left 0.28s;
}
.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style> -->
