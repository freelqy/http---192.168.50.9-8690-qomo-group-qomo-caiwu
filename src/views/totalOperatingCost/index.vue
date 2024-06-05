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
  totalOperatingCostList,
  totalOperatingCostDelete,
  totalOperatingCostDeleteBatch,
  totalOperatingCostForecast,
  totalOperatingCostDetailList,
  totalOperatingCostDetailEdit,
  totalOperatingCostDetailExportXls
} from "@/api/index";
import { transformPageResponse, disabledPreviousMonths } from "@/utils/qomo";
import _ from "lodash";
import { download, REGEXS } from "@qomo-platform/utils";

export default defineComponent({
  name: "totalOperatingCost",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const forecastDialogRef = ref(null);
    const tableRefChild = ref(null);
    const fluterDialogRef = ref(null);
    const selectRow = ref(null);

    const columns = ref<BaseTableColumnType>([
      { type: "selection", fixed: true },
      { type: "index", fixed: true, label: "序号", width: 60 },
      { label: "预测月份", prop: "forecastMonth", fixed: true },
      {
        label: "预测版本",
        prop: "forecastVersion",
        render: ({ row }) => <span>V{row?.forecastVersion}</span>
      },
      { label: "创建时间", prop: "createTime", valueType: "date" },
      { label: "创建人", prop: "createBy" },
      {
        label: "营业成本（元）",
        prop: "totalOperatingCosts",
        valueType: "amountThousands",
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
                  selectRow.value = row;
                  fluterDialogRef.value.open();
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
      {
        label: "业务板块",
        prop: "businessSegment",
        fixed: true,
        hideInAddOrEditForm: true
      },
      {
        label: "年月",
        prop: "yearMonths",
        valueType: "date",
        hideInAddOrEditForm: true
      },
      { label: "子项目号", prop: "sonProCode", hideInAddOrEditForm: true },
      {
        label: "子项目名称",
        prop: "sonProName",
        hideInAddOrEditForm: true,
        hideInSearchForm: true
      },
      {
        label: "描述",
        prop: "desc",
        hideInAddOrEditForm: true,
        hideInSearchForm: true
      },
      {
        label: "五级分类",
        hideInAddOrEditForm: true,
        prop: "fiveLevelClass",
        hideInSearchForm: true
      },
      {
        label: "币种",
        prop: "currency",
        hideInAddOrEditForm: true,
        hideInSearchForm: true
      },
      {
        label: "毛利率来源",
        prop: "grossMarginSources",
        hideInAddOrEditForm: true,
        hideInSearchForm: true
      },
      {
        label: "月度收入",
        prop: "monthlyIncome",
        hideInAddOrEditForm: true,
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "项目毛利率",
        hideInAddOrEditForm: true,
        prop: "projectGrossMargin",
        hideInSearchForm: true
      },
      {
        label: "核定毛利率",
        prop: "approvedGrossMargin",
        hideInSearchForm: true,
        extraProps: {
          placeholder: "若核定毛利 修改核定毛利率率为25%，请填写0.25"
        }
      },
      {
        label: "项目成本",
        prop: "projectCost",
        hideInAddOrEditForm: true,
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        type: "operation",
        label: "操作",
        width: 160,
        render: ({ row, doAddOrEdit, doDeleteRows, doPreview }) => (
          <base-table-operation
            btnList={[
              {
                key: "edit",
                label: "修改核定毛利率",
                onClick: () => {
                  doAddOrEdit(row);
                }
              }
            ]}
          />
        )
      }
    ]);
    expose(exposeDialogArgs);

    const forecastOpen = () => {
      forecastDialogRef.value.open();
    };

    const handleOK = async model => {
      await totalOperatingCostForecast(model);
      tableRef.value.doReload();
    };

    const exportXlsChild = async () => {
      const response = await totalOperatingCostDetailExportXls({
        mainId:selectRow.value?.id
      });
      download(response, `总成本预测明细.xlsx`);
    };

    const renderTableForm = () => (
      <base-page-container flex-hidden={true}>
        <base-table
          ref={tableRefChild}
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
              await totalOperatingCostDetailList({
                pageNo: current,
                pageSize,
                mainId: selectRow.value?.id,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onAddOrEdit(data) {
              await totalOperatingCostDetailEdit(data);
            },
            labelWidth: "150px",
            rules: {
              approvedGrossMargin: [
                {
                  required: true,
                  pattern: REGEXS.num,
                  message: "只能输入数字类型"
                }
              ]
            }
          }}
        ></base-table>
      </base-page-container>
    );

    const renderForm = model => (
      <>
        <el-form-item
          label="预测年月："
          prop="forecastMonth"
          rules={[
            {
              required: true,
              message: "请选择预测年月",
              trigger: "blur"
            }
          ]}
        >
          <el-date-picker
            value-format={"YYYY-MM"}
            v-model={model.forecastMonth}
            type="month"
            disabled-date={disabledPreviousMonths}
          />
        </el-form-item>
      </>
    );

    return () => (
      <base-page-container flex-hidden={true}>
        <base-dialog
          ref={fluterDialogRef}
          title={"明细"}
          width={"85%"}
          v-slots={{
            default: renderTableForm
          }}
        />
        <base-dialog-form
          ref={forecastDialogRef}
          title={"预测"}
          width={400}
          rules={{
            forecastMonth: [
              { required: true, message: "请选择预测年月", trigger: "blur" }
            ]
          }}
          confirm={handleOK}
          v-slots={{
            default: ({ model }) => renderForm(model)
          }}
        />
        <base-table
          ref={tableRef}
          autoCalculateWidth
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton type="primary" onClick={forecastOpen}>
                  获取预测总成本
                </BaseTableToolbarButton>
                <BaseTableToolbarButton
                  type="danger"
                  disabled={!selectionRows?.length}
                  onClick={doDeleteRows}
                >
                  删除
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
              await totalOperatingCostList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onDeleteRows(selectionRows) {
              Array.isArray(selectionRows)
                ? await totalOperatingCostDeleteBatch({
                    ids: selectionRows.map(item => item.id).join(",")
                  })
                : await totalOperatingCostDelete({
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
