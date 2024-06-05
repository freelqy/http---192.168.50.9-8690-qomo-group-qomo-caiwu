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
  costForecastDetailExportXls,
  monthlyProfitDetailList
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
        label: "一月",
        prop: "m01",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "二月",
        prop: "m02",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "三月",
        prop: "m03",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "四月",
        prop: "m04",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "五月",
        prop: "m05",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "六月",
        prop: "m06",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "七月",
        prop: "m07",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "八月",
        prop: "m08",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "九月",
        prop: "m09",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "十月",
        prop: "m10",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "十一月",
        prop: "m11",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "十二月",
        prop: "m12",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "累加",
        prop: "total",
        valueType: "amountThousands",
        fixed: "right",
        hideInSearchForm: true
      }
    ]);

    expose(exposeDialogArgs);

    const exportXlsChild = async () => {
      const response = await costForecastDetailExportXls();
      download(response, `分月利润汇总表.xlsx`);
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
                分月利润汇总表
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
              await monthlyProfitDetailList({
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
