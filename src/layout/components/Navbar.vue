<template>
  <!--  -->
  <div
    :style="{ background: settingsStore.theme }"
    class="navbar h-[60px] flex justify-between"
  >
    <div class="left-box flex items-center">
      <div class="logo-box h-full flex items-center pl-4 cursor-pointer">
        <div class="logo w-[180px] h-[40px]"></div>
        <div class="home w-[14px] h-[14px]"></div>
      </div>
      <hamburger
        id="hamburger-container"
        :is-active="appStore.sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <!--      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />-->
    </div>

    <div class="right-menu leading-[60px]">
      <template v-if="appStore.device !== 'mobile'">
        <header-search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
      <div class="avatar-container">
        <el-dropdown
          class="right-menu-item hover-effect"
          trigger="click"
          @command="handleCommand"
        >
          <div class="avatar-wrapper flex items-center">
            <img
              :src="userStore.avatar"
              alt=""
              class="user-avatar rounded-[50%]"
            />

            <span class="text-[12px] inline-block pl-2">{{
              userStore.userInfo.realname
            }}</span>

            <!--            <el-icon><caret-bottom /></el-icon>-->
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item
                v-if="settingsStore.showSettings"
                command="setLayout"
              >
                <span>布局设置</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import HeaderSearch from "@/components/HeaderSearch";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import useUserStore from "@/store/modules/user";

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();

defineProps({
  showBreadcrumb: { type: Boolean, default: true } // 是否显示左侧面包屑
});

function toggleSideBar() {
  appStore.toggleSideBar();
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = "/index";
      });
    })
    .catch(() => {});
}

const emits = defineEmits(["setLayout"]);
function setLayout() {
  emits("setLayout");
}
</script>

<style lang="scss" scoped>
.navbar {
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .logo {
    background: url("@/assets/images/logo.png") no-repeat;
    background-size: cover;
  }
  .home {
    background: url("@/assets/images/home.png") no-repeat;
    background-size: cover;
  }

  .hamburger-container {
    line-height: 60px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    color: #fff;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
    color: #fff !important;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    display: flex;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 40px;
      .avatar-wrapper {
        margin-top: 10px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
