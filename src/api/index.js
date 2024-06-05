import request from "@/service/request";


export function getDictCode(params) {
  return request.get(`/sys/dictItem/type`,params);
}

/**
 * 最新月度计划表
 */
export function invoicingBudgetMouthList(params) {
  return request.get("/invoicingBudgetMouth/list", params);
}

export function invoicingBudgetMouthDelete(data) {
  return request.delete(
    "/invoicingBudgetMouth/delete",
    data,
    { message: true }
  );
}

export function invoicingBudgetMouthDeleteBatch(data) {
  return request.delete(
    "/invoicingBudgetMouth/deleteBatch",
    data,
    { message: true }
  );
}

export function exportXls(params) {
  return request.get(
    "/invoicingBudgetMouth/exportXls",
    params,
    { responseType: "blob" }
  );
}

export function invoicingBudgetMouthEdit(data) {
  return request.post("/invoicingBudgetMouth/edit", {}, data, {
    message: {
      success: `编辑成功`,
      error: true
    }
  });
}

export function invoicingBudgetMouthAdd(data) {
  return request.post("/invoicingBudgetMouth/add", {}, data, {
    message: {
      success: `新增成功`,
      error: true
    }
  });
}

/**
 * 板块毛利率
 */
export function sectorGrossMarginList(params) {
  return request.get("/sectorGrossMargin/list", params);
}

export function sectorGrossMarginDelete(data) {
  return request.delete(
    "/sectorGrossMargin/delete",
    data,
    { message: true }
  );
}

export function sectorGrossMarginDeleteBatch(data) {
  return request.delete(
    "/sectorGrossMargin/deleteBatch",
    data,
    { message: true }
  );
}

export function sectorGrossMarginExportXls(params) {
  return request.get(
    "/sectorGrossMargin/exportXls",
    params,
    { responseType: "blob" }
  );
}

export function projectSectorGrossMargin(params) {
  return request.get(
    "/projectBidGrossMargin/genBidGrossMargin",
    params,
    {
      message: {
        success: true
      }
    }
  );
}



/**
 * 项目投标毛利率
 */
export function projectBidGrossMarginList(params) {
  return request.get("/projectBidGrossMargin/list", params);
}

export function projectBidGrossMarginDelete(data) {
  return request.delete(
    "/projectBidGrossMargin/delete",
    data,
    { message: true }
  );
}

export function projectBidGrossMarginDeleteBatch(data) {
  return request.delete(
    "/projectBidGrossMargin/deleteBatch",
    data,
    { message: true }
  );
}

export function projectBidGrossMarginExportXls(params) {
  return request.get(
    "/projectBidGrossMargin/exportXls",
    params,
    { responseType: "blob" }
  );
}

export function genSectorGrossMargin(params) {
  return request.get(
    "/sectorGrossMargin/genSectorGrossMargin",
    params,
    {
      message: {
        success: true
      }
    }
  );
}

export function genBidGrossMargin(params) {
  return request.get(
    "/projectBidGrossMargin/genBidGrossMargin",
    params,
    {
      message: {
        success: true
      }
    }
  );
}

export function projectBidGrossMarginAdd(data) {
  return request.post("/projectBidGrossMargin/add", {}, data, {
    message: {
      success: `新增成功`,
      error: true
    }
  });
}

export function projectBidGrossMarginEdit(data) {
  return request.post("/projectBidGrossMargin/edit", {}, data, {
    message: {
      success: `编辑成功`,
      error: true
    }
  });
}


/**项目毛利率 */

export function projectGrossMarginList(params) {
  return request.get("/projectGrossMargin/list", params);
}

export function projectGrossMarginExportXls(params) {
  return request.get(
    "/projectGrossMargin/exportCumulativeXls",
    params,
    { responseType: "blob" }
  );
}

export function cumulativeListList(params) {
  return request.get("/projectGrossMargin/cumulativeList", params);
}

export function projectGrossMarginChildExportXls(params) {
  return request.get(
    "/projectGrossMargin/exportXls",
    params,
    { responseType: "blob" }
  );
}


/**营业总成本 */
export function totalOperatingCostList(params) {
  return request.get("/totalOperatingCost/list", params);
}

export function totalOperatingCostForecast(data) {
  return request.post("/totalOperatingCost/forecast", {}, data, {
    message: {
      success: `预测成功`,
      error: true
    }
  });
}

export function totalOperatingCostDelete(data) {
  return request.delete(
    "/totalOperatingCost/delete",
    data,
    { message: true }
  );
}

export function totalOperatingCostDeleteBatch(data) {
  return request.delete(
    "/totalOperatingCost/deleteBatch",
    data,
    { message: true }
  );
}

export function totalOperatingCostDetailList(params) {
  return request.get("/totalOperatingCostDetail/list", params);
}

export function totalOperatingCostDetailEdit(data) {
  return request.post("/totalOperatingCostDetail/edit", {}, data,
    { message: true }
  );
}


export function totalOperatingCostDetailExportXls(params) {
  return request.get(
    "/totalOperatingCostDetail/exportXls",
    params,
    { responseType: "blob" }
  );
}



/**营业总收入 */
export function totalOperatingIncomeList(params) {
  return request.get("/totalOperatingIncome/list", params);
}

export function totalOperatingIncomeForecast(data) {
  return request.post("/totalOperatingIncome/forecast", {}, data, {
    message: {
      success: `预测成功`,
      error: true
    }
  });
}

export function totalOperatingIncomeDelete(data) {
  return request.delete(
    "/totalOperatingIncome/delete",
    data,
    { message: true }
  );
}

export function totalOperatingIncomeDeleteBatch(data) {
  return request.delete(
    "/totalOperatingIncome/deleteBatch",
    data,
    { message: true }
  );
}


/**费用预测 */
export function costForecastList(params) {
  return request.get("/costForecast/list", params);
}

export function costForecastForecast(data) {
  return request.post("/costForecast/forecast", {}, data, {
    message: {
      success: `预测成功`,
      error: true
    }
  });
}

export function costForecastDelete(data) {
  return request.delete(
    "/costForecast/delete",
    data,
    { message: true }
  );
}

export function costForecastDetailList(params) {
  return request.get("/costForecastDetail/list", params);
}

export function costForecastDetailExportXls(params) {
  return request.get(
    "/costForecastDetail/exportXls",
    params,
    { responseType: "blob" }
  );
}


/**分月利润预测 */
export function monthlyProfitList(params) {
  return request.get("/monthlyProfit/list", params);
}

export function monthlyProfitDelete(data) {
  return request.delete(
    "/monthlyProfit/delete",
    data,
    { message: true }
  );
}

export function costForecastListByYearMonth(data) {
  return request.post("/costForecast/listByYearMonth", {}, data, {
    message: {
      error: true
    }
  });
}

export function totalOperatingCostListByYearMonth(data) {
  return request.post("/totalOperatingCost/listByYearMonth", {}, data, {
    message: {
      error: true
    }
  });
}

export function totalOperatingIncomeListByYearMonth(data) {
  return request.post("/totalOperatingIncome/listByYearMonth", {}, data, {
    message: {
      error: true
    }
  });
}

export function monthlyProfitForecast(data) {
  return request.post("/monthlyProfit/forecast", {}, data, {
    message: {
      success: `预测成功`,
      error: true
    }
  });
}

export function monthlyProfitDetailList(params) {
  return request.get("/monthlyProfitDetail/list", params);
}

export function monthlyProfitSave(data) {
  return request.post("/monthlyProfit/save", {}, data, {
    message: {
      success: `暂存成功`,
      error: true
    }
  });
}

export function monthlyProfitQueryById(params) {
  return request.get("/monthlyProfit/queryById", params);
}




//汇总利润
export function sumProfitList(params) {
  return request.get("/sumProfit/list", params);
}

export function sumProfitDelete(data) {
  return request.delete(
    "/sumProfit/delete",
    data,
    { message: true }
  );
}
export function sumProfitDetailList(params) {
  return request.get("/sumProfitDetail/list", params);
}

export function sumProfitDetailExportXls(params) {
  return request.get(
    "/sumProfitDetail/exportXls",
    params,
    { responseType: "blob" }
  );
}

//利润偏差分析
export function profitDeviationAnalysisList(params) {
  return request.get("/profitDeviationAnalysis/list", params);
}

export function profitDeviationAnalysisDelete(data) {
  return request.delete(
    "/profitDeviationAnalysis/delete",
    data,
    { message: true }
  );
}
export function profitDeviationAnalysisDetailList(params) {
  return request.get("/profitDeviationAnalysisDetail/list", params);
}

export function profitDeviationAnalysisDetailExportXls(params) {
  return request.get(
    "/profitDeviationAnalysisDetail/exportXls",
    params,
    { responseType: "blob" }
  );
}

//应收逾期账龄-实际
export function receivableAgeActualList(params) {
  return request.get("/receivableAgeActual/list", params);
}

export function receivableAgeList(params) {
  return request.get("/receivableAge/list", params);
}

//应收逾期账龄-預計
export function receivableAgeExpectList(params) {
  return request.get("/receivableAgeExpect/list", params);
}

//应收账款坏账计提
export function badDebtProvisionList(params) {
  return request.get("/badDebtProvision/list", params);
}

export function badDebtProvisionAdd(data) {
  return request.post("/badDebtProvision/add", {}, data, {
    message: {
      success: `获取成功`,
      error: true
    }
  });
}

export function badDebtProvisionDelete(data) {
  return request.delete(
    "/badDebtProvision/delete",
    data,
    { message: true }
  );
}

export function badDebtProvisionDetailList(params) {
  return request.get("/badDebtProvisionDetail/list", params);
}

export function badDebtProvisionDetailDelete(data) {
  return request.delete(
    "/badDebtProvisionDetail/delete",
    data,
    { message: true }
  );
}

export function badDebtProvisionDetailEdit(data) {
  return request.post("/badDebtProvisionDetail/edit", {}, data, {
    message: true
  });
}

