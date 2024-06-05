import { login as apiLogin, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";
import defAva from "@/assets/images/profile.jpg";

const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    id: "",
    name: "",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    roles: [],
    permissions: [],
    userInfo: {}
  }),
  actions: {
    // 登录
    login(userInfo) {
      return new Promise((resolve, reject) => {
        apiLogin(userInfo)
          .then(res => {
            setToken(res.token);
            this.token = res.token;

            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            const { result } = res;
            this.userInfo = result.userInfo;
            this.id = result.userInfo.id;
            this.name = result.userInfo.realname;
            if (result?.sysRoles && result?.sysRoles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = result.sysRoles.map(v => v.roleCode);
              this.permissions = result.permissions ?? ["*:*:*"];
            } else {
              this.roles = ["ROLE_DEFAULT"];
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = "";
            this.roles = [];
            this.permissions = [];
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
  persist: true
});

export default useUserStore;
