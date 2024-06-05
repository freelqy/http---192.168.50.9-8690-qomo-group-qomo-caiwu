import request from "@/service/request";

/**
 * @description 登录方法
 */
export function login(data) {
  return request.post(
    "/sys/login",
    {},
    data,
    {
      headers: {
        isToken: false,
        repeatSubmit: false
      },
      message: {
        error: true
      },
    }
  );
}

/**
 * @description 注册方法
 */
export function register(data) {
  return request({
    url: "/register",
    headers: {
      isToken: false
    },
    method: "post",
    data: data
  });
}

/**
 * @description 获取用户详细信息
 */
export function getInfo() {
  return request.get("/sys/user/getUserInfo");
}

/**
 * @description 退出方法
 */
export function logout() {
  return request({
    url: "/sys/logout",
    method: "post"
  });
}

/**
 * @description 获取验证码
 */
export function getCodeImg(data) {
  return request.get(`/sys/randomImage/${data}`,
  {},
  {
    headers: {
      isToken: false
    },
    method: "get",
    timeout: 20000
  }
  );
}
