import request from "@/service/request";

// 获取路由
export const getRouters = () => {
  return request({
    url: "/getRouters",
    method: "get"
  });
};

export const listByApp = params => {
  return request.get('/sys/permission/listByApp',params)
}
