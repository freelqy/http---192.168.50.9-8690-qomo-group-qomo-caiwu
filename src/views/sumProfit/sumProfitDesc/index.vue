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
import { sumProfitDetailExportXls, sumProfitDetailList } from "@/api/index";
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
      // { type: "selection", fixed: true },
      // { type: "index", fixed: true, label: "序号", width: 60 },
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
        label: "去年同期",
        prop: "samePeriodLastYear",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "预算数",
        prop: "budgetAmount",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "预测数",
        prop: "forecastAmount",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "较上年同期实际",
        prop: "actualYearOnYear",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "超年初预算",
        prop: "budgetExceedingYear",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "较上年同期增减",
        prop: "increaseOrDecreaseOverLastYear",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "预算执行率",
        prop: "budgetExecutionRate",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "去年同期累计",
        prop: "samePeriodLastYear",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "年初预算数-累计",
        prop: "budgetAmountYearSum",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "实际数-累计",
        prop: "actualAmountSum",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "较上年同期实际-累计",
        prop: "m11",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "超年初预算数-累计",
        prop: "actualYearOnYearSum",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "较上年同期增减-累计",
        prop: "increaseOrDecreaseOverLastYearSum",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "预算执行率-累计",
        prop: "budgetExecutionRateSum",
        valueType: "amountThousands",
        hideInSearchForm: true
      }
    ]);

    expose(exposeDialogArgs);

    const exportXlsChild = async () => {
      const response = await sumProfitDetailExportXls({
        ...form
      });
      download(response, `汇总利润预测详情.xlsx`);
    };

    return () => (
      <base-page-container flex-hidden={true}>
        <base-table
          ref={tableRef}
          pagination={false}
          autoCalculateWidth
          report
          table={{
            rowClassName: ({ row, index }) =>
              regexValidate(row?.itemName, "reprotBold") ? "font-bold" : ""
          }}
          toolbar={{
            toolbarTitleElements: () => (
              <span class="text-[#353535] font-bold text-[16px]">
                汇总利润预测详情
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
              await sumProfitDetailList({
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
