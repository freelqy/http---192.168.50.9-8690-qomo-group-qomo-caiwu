<script setup>
import SvgIcon from "@/components/SvgIcon";

const leftMenu = ref([
  {
    title: "首页",
    icon: "home",
    path: "/index"
  },
  {
    title: "系统管理",
    icon: "setting",
    path: "/system"
  }
]);
</script>

<template>
  <div
    class="left-menu-box w-[120px] bg-white h-full flex flex-col items-center"
  >
    <template v-for="item in leftMenu" :key="item.path">
      <div
        class="menu-box w-[100px] flex flex-col items-center p-[11px] rounded cursor-pointer transition-all duration-300 ease-in-out mt-[8px]"
      >
        <svg-icon
          :icon-class="item.icon"
          class-name="text-[#A1A7B2] text-[22px] icon-box"
        />
        <span class="text-[#A1A7B2] text-[14px] inline-block mt-2">{{
          item.title
        }}</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.menu-box {
  &:hover {
    background-color: var(--el-color-primary);
    color: white;
    span,
    .icon-box {
      color: white;
    }
  }
}
</style>
