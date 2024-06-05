<script lang="tsx">
import {
  computed,
  defineComponent,
  ref,
  onMounted,
  watchEffect,
  watch
} from "vue";
import { useExposeDialogArgs } from "@qomo-platform/core";
import { BaseTableColumnType } from "@qomo-platform/component/dist/types/BaseTable/shared";
import {
  sumProfitDetailExportXls,
  profitDeviationAnalysisDetailList
} from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";
import { download, regexValidate } from "@qomo-platform/utils";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "monthlyProfitDesc",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const selectRow = ref(null);
    const route = useRoute();

    const columns = ref<BaseTableColumnType>([
      {
        label: "项目",
        prop: "itemName",
        render: ({ row }) =>
          regexValidate(row?.itemName, "reprotBold") ? (
            <span class="font-bold">{row?.itemName}</span>
          ) : (
            row?.itemName
          ),
        hideInSearchForm: true,
        fixed: "left"
      },
      {
        label: "业务板块",
        prop: "businessSegment",
        hideInTable: true,
        renderFormItem: ({ model }) => (
          <dict-select
            dictType="basic_business_type"
            v-model={model.businessSegment}
            type="month"
          />
        )
      },
      {
        label: "当月预测",
        prop: "monthlyForecast",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "当月预算",
        prop: "monthlyBudget",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "当月实际",
        prop: "monthlyActual",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "实际较预测偏差金额",
        prop: "actualDeviationFromForecast",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "实际较预测偏差率",
        prop: "actualDeviationFromForecastRate",
        valueType: "amountThousands",
        hideInSearchForm: true
      }
    ]);

    expose(exposeDialogArgs);

    const exportXlsChild = async () => {
      const response = await profitDeviationAnalysisDetailExportXls();
      download(response, `利润预测偏差详情.xlsx`);
    };

    return () => (
        <base-page-container flex-hidden={true}>
          <base-table
            report
            ref={tableRef}
            pagination={false}
            autoCalculateWidth
            table={{
              rowClassName: ({ row, index }) =>
                regexValidate(row?.itemName, "reprotBold") ? "font-bold" : ""
            }}
            toolbar={{
              toolbarTitleElements: () => (
                <span class="text-[#353535] font-bold text-[16px]">
                  利润预测偏差详情
                </span>
              ),
              layoutElements: () => (
                <ElTooltip content={"导出"} placement="top">
                  <el-icon
                    size={24}
                    color={"#888888"}
                    onClick={exportXlsChild}
                    class="pointer"
                  >
                    <Download />
                  </el-icon>
                </ElTooltip>
              ),
              layout: ["fullscreen"]
            }}
            auto-height
            search={{
              initFormData: {
                businessSegment: "轨道总部"
              }
            }}
            columns={columns.value}
            request={async ({
              pageSize = 10,
              current = 1,
              ...otherSearchParams
            }) => {
              return transformPageResponse(
                await profitDeviationAnalysisDetailList({
                  pageNo: current,
                  pageSize: 100,
                  ...otherSearchParams,
                  mainId: route?.params?.id
                })
              );
            }}
          ></base-table>
        </base-page-container>
    );
  }
});
</script>
<style scoped lang="scss"></style>
