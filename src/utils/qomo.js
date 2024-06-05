/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
  let result = "";
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    let part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof value !== "undefined") {
      if (typeof value === "object") {
        for (const key of Object.keys(value)) {
          if (
            value[key] !== null &&
            value[key] !== "" &&
            typeof value[key] !== "undefined"
          ) {
            let params = propName + "[" + key + "]";
            let subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result;
}

/**
 * 验证是否为blob格式
 */
export function blobValidate(data) {
  return data.type !== "application/json";
}

/**
 *  表单重置
 */
export function resetForm(form) {
  if (Object.prototype.toString.call(form) !== "[object Object]") return false;
  Object.keys(form).forEach(key => {
    if (key === "pageSize") {
      form[key] = 10;
    } else if (key === "pageNo") {
      form[key] = 1;
    } else if (key === "dynamicParams") {
      form[key] = [];
    } else {
      form[key] = undefined;
    }
  });
}

// 将下划线转成大驼峰
export function underlineToGreatCamelPeak(str) {
  const arr = str.split("_");
  let result = "";
  arr.forEach(item => {
    let newItem = item[0].toUpperCase() + item.slice(1);
    result += newItem;
  });
  return result;
}

// excel导出
export const exportFile = (res, name) => {
  const blob = new Blob([res]);
  const href = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = href;
  link.download = `${name}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

//请求返回包装
export const transformPageResponse = data => {
  if (Array.isArray(data)) {
    return {
      data: data || []
    };
  } else
    return {
      data: data?.records,
      current: data?.current,
      pages: data?.pages,
      total: data?.total
    };
};

//禁用月份选择器当前月份以前的月份
export const disabledPreviousMonths = time => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const selectedYear = time.getFullYear();
  const selectedMonth = time.getMonth();

  return (
    selectedYear < currentYear ||
    (selectedYear === currentYear && selectedMonth < currentMonth)
  );
};

//只能選擇3\6\9\12
export const disabledMonthsReals = time => {
  const month = time.getMonth() + 1;
  // 只允许选择 3、6、9、12 这四个月份
  return ![3, 6, 9, 12].includes(month);
};
