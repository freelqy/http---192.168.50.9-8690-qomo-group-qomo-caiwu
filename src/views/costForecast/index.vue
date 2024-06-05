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
  costForecastList,
  costForecastDetailList,
  costForecastForecast,
  costForecastDelete,
  costForecastDetailExportXls
} from "@/api/index";
import { transformPageResponse,disabledPreviousMonths } from "@/utils/qomo";
import _ from "lodash";
import { download } from "@qomo-platform/utils";

export default defineComponent({
  name: "costForecast",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const tableRefChild = ref(null);
    const fluterDialogRef = ref(null);
    const descDialogRef = ref(null);
    const selectRow = ref(null)
    const form = reactive({
      yearMonths: ""
    });
    const columns = ref<BaseTableColumnType>([
      { type: "selection", fixed: true },
      { type: "index", fixed: true, label: "序号", width: 60 },
      { label: "预测月份", prop: "forecastMonth", valueType: "month" },
      {
        label: "预测版本",
        prop: "forecastVersion",
        render: ({ row }) => <span>V{row?.forecastVersion}</span>,
        hideInSearchForm: true,
        hideInSearchFilter:true
      },
      { label: "创建时间", prop: "createTime", valueType: "date" },
      { label: "创建人", prop: "createBy" },
      {
        label: "费用总额（元）",
        prop: "totalCost",
        valueType:'amountThousands',
        hideInSearchForm: true
      },
      {
        type: "operation",
        label: "操作",
        width: 120,
        render: ({ row, doAddOrEdit, doDeleteRows, doPreview }) => (
          <base-table-operation
            btnList={[
              {
                key: "delete",
                label: "删除",
                onClick: () => doDeleteRows(row)
              },
              {
                key: "preview",
                label: "详情",
                onClick: () => {
                  selectRow.value = row
                  descDialogRef.value.open()
                }
              }
            ]}
          />
        )
      }
    ]);

    const columnsChild = ref<BaseTableColumnType>([
      { type: "selection", fixed: true },
      { type: "index", fixed: true, label: "序号", width: 60 },
      { label: "年月", prop: "yearMonths" },
      { label: "业务板块", prop: "businessSegment" },
      { label: "费用科目编号", prop: "accountCode" },
      { label: "费用科目名称", prop: "accountName", hideInSearchForm: true },
      { label: "费用类型", prop: "accountType", hideInSearchForm: true },
      {
        label: "本月预算费用",
        prop: "budgetCost",
        valueType:'amountThousands',
        hideInSearchForm: true
      },
      {
        label: "SAP已发生费用",
        prop: "sapIncurredCost",
        valueType:'amountThousands',
        hideInSearchForm: true
      },
      {
        label: "费控审批费用",
        prop: "costControlApprovalCost",
        valueType:'amountThousands',
        hideInSearchForm: true
      },
      {
        label: "调整费用",
        prop: "adjustCost",
        valueType:'amountThousands',
        hideInSearchForm: true
      },
      {
        label: "预测费用",
        prop: "forecastCost",
        valueType:'amountThousands',
        hideInSearchForm: true
      },
      {
        label: "偏差费用",
        prop: "deviationCost",
        valueType:'amountThousands',
        hideInSearchForm: true
      }
    ]);

    expose(exposeDialogArgs);

    const getFluterOpen = () => {
      fluterDialogRef.value.open();
    };

    const handleOK = async model => {
      await costForecastForecast(model);
      tableRef.value.doReload();
      // return false
    };

    // const exportXls = async () => {
    //   const response = await projectGrossMarginExportXls({
    //     ...form
    //   });
    //   download(response, `项目毛利率.xlsx`);
    // };

    const exportXlsChild = async () => {
      const response = await costForecastDetailExportXls({
        ...form
      });
      download(response, `费用预测明细.xlsx`);
    };

    const renderForm = () => (
    <div style={{
       height:"calc(100% - 600px)",
       overflow:'auto',
       display:"flex"
    }}>
      <base-page-container flex-hidden={true} >
        <base-table
          ref={tableRefChild}
          tableKey='tableKeyChildrens'
          autoCalculateWidth
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton type="primary" onClick={exportXlsChild}>
                  导出
                </BaseTableToolbarButton>
              </el-space>
            )
          }}
          toolbar={{ layout: "search-dnamic,reload,column-setting,fullscreen" }}
          auto-height
          columns={columnsChild.value}
          request={async ({
            pageSize = 10,
            current = 1,
            ...otherSearchParams
          }) => {
            return transformPageResponse(
              await costForecastDetailList({
                pageNo: current,
                pageSize,
                ...otherSearchParams,
                mainId:selectRow?.value?.id
              })
            );
          }}
          curdConfig={{
            async onDeleteRows(selectionRows) {
              await costForecastDelete({
                id: selectionRows.id
              });
            },
            labelWidth: "170px"
          }}
        ></base-table>
      </base-page-container>
      </div>
    );

    const renderFormfluter = model => (
      <>
        <el-form-item label="年月：" prop="forecastMonth">
          <el-date-picker
            value-format={"YYYY-MM"}
            v-model={model.forecastMonth}
            disabled-date={disabledPreviousMonths}
            type="month"
          />
        </el-form-item>
      </>
    );

    return () => (
      <base-page-container flex-hidden={true}>
        <base-dialog
          ref={descDialogRef}
          height={400}
          title={"明细"}
          width={"85%"}
          confirm={handleOK}
          v-slots={{
            default: renderForm
          }}
        />
        <base-dialog-form
          ref={fluterDialogRef}
          title={"获取预测费用"}
          confirmButtonText='开始预测'
          width={400}
          rules={{
            forecastMonth: [
              { required: true, message: "请选择预测年月", trigger: "blur" }
            ]
          }}
          confirm={handleOK}

          v-slots={{
            default: ({ model }) => renderFormfluter(model)
          }}
        />
        <base-table
          ref={tableRef}
          autoCalculateWidth
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton type="primary" onClick={getFluterOpen}>
                  获取预测费用
                </BaseTableToolbarButton>
              </el-space>
            )
          }}
          toolbar={{ layout: "search-dnamic,reload,column-setting,fullscreen" }}
          auto-height
          columns={columns.value}
          request={async ({
            pageSize = 10,
            current = 1,
            ...otherSearchParams
          }) => {
            return transformPageResponse(
              await costForecastList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onDeleteRows(selectionRows) {
              await costForecastDelete({
                id: selectionRows.id
              });
            },
            labelWidth: "170px"
          }}
        ></base-table>
      </base-page-container>
    );
  }
});
</script>
<style scoped lang="scss"></style>
