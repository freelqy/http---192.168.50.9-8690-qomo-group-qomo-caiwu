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
  invoicingBudgetMouthList,
  invoicingBudgetMouthDelete,
  invoicingBudgetMouthDeleteBatch,
  exportXls,
  invoicingBudgetMouthEdit,
  invoicingBudgetMouthAdd
} from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";
import {download} from "@qomo-platform/utils";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "latestMonthSch",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const route = useRoute();
    const exportDialogRef = ref(null);
    const form = reactive({
      department: "国内业务",
      yearMonth: ""
    });
    const columns = ref<BaseTableColumnType>([
      { type: "selection",fixed:true },
      { label: "业务板块", prop: "department",fixed:true },
      { label: "年月", prop: "yearMonth" },
      { label: "计划时间", prop: "planDate", valueType: "date" },
      { label: "主项目号", prop: "masterProCode" },
      { label: "主项目名称", prop: "masterProName", hideInSearchForm: true },
      { label: "子项目号", prop: "sonProCode", hideInSearchForm: true },
      { label: "子项目名", prop: "sonProName", hideInSearchForm: true },
      { label: "Wbs号", prop: "wbsCode", hideInSearchForm: true },
      {
        label: "计划开票金额",
        prop: "planInvoicingAmount",
        valueType:'amountThousands',
        hideInSearchForm: true
      },
      {
        label: "开票公司代码",
        prop: "invoicingCompanyCode",
        hideInSearchForm: true
      },
      {
        label: "对外销售子项目",
        prop: "saleSonProCode",
        hideInSearchForm: true
      },
      { label: "是否开票", prop: "needInvoicing", hideInSearchForm: true },
      {
        label: "SAP实际开票金额",
        prop: "sapInvoicingAmount",
        valueType:'amountThousands',
        hideInSearchForm: true
      },
      {
        label: "生产计划完成时间",
        prop: "prodCompletionDate",
        valueType: "date",
        hideInSearchForm: true
      },
      { label: "生产状态", prop: "prodStatus", hideInSearchForm: true },
      { label: "发货状态", prop: "shipmentStatus", hideInSearchForm: true },
      { label: "开票状态", prop: "invoicingStatus", hideInSearchForm: true },
      {
        label: "计划调整金额",
        prop: "planAdjustAmount",
        valueType:'amountThousands',
        hideInSearchForm: true,
      },
      {
        type: "operation",
        label: "操作",
        width:140,
        render: ({ row, doAddOrEdit, doDeleteRows,doPreview }) => (
          <base-table-operation
            btnList={[
              {
                key: "edit",
                label: "修改",
                onClick: () =>
                  doAddOrEdit({
                    ...row
                  })
              },
              { key: "delete",icon:'Delete', label: "删除", onClick: () => doDeleteRows(row) },
              { key: "preview",icon:"View",label: "查看", onClick: () => doPreview(row) }
            ]}
          />
        )
      }
    ]);

    expose(exposeDialogArgs);

    const exportOpen = () => {
      exportDialogRef.value.open();
    };

    const handleOK = async () => {
      const response = await exportXls({
        ...form
      });
      download(response, `最新月度计划表.xlsx`);
    };
    const renderForm = () => (
      <>
        <el-form model={form} labelWidth={"120px"}>
          <el-form-item label="业务板块：">
            <el-input v-model={form.department} />
          </el-form-item>
          <el-form-item label="年月：">
            <el-date-picker
              value-format={"YYYY-MM"}
              v-model={form.yearMonth}
              type="month"
            />
          </el-form-item>
        </el-form>
      </>
    );

    return () => (
      <base-page-container flex-hidden={true}>
        <base-dialog
          ref={exportDialogRef}
          title={"导出"}
          labelWidth={"120px"}
          width={800}
          confirm={handleOK}
          v-slots={{
            default: renderForm
          }}
        />
        <base-table
          ref={tableRef}
          autoCalculateWidth
          search={{
              initFormData: {
                yearMonth: route?.query?.forecastMonth || ''
              }
            }}
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton icon="Plus" type="primary" onClick={doAddOrEdit}>
                  新增
                </BaseTableToolbarButton>
                <BaseTableToolbarButton icon="Download" type="primary" onClick={exportOpen}>
                  导出
                </BaseTableToolbarButton>
                {/* <BaseTableToolbarButton icon="Upload" type="primary" onClick={uploadOpen}>
                  导入
                </BaseTableToolbarButton> */}
                <BaseTableToolbarButton
                  type="danger"
                  icon="Delete"
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
              await invoicingBudgetMouthList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onAddOrEdit(data) {
              data?.id ? await invoicingBudgetMouthEdit(data) :
              await invoicingBudgetMouthAdd(data)
            },
            //删除数据
            async onDeleteRows(selectionRows) {
              Array.isArray(selectionRows)
                ? await invoicingBudgetMouthDeleteBatch({
                    ids: selectionRows.map(item => item.id).join(",")
                  })
                : await invoicingBudgetMouthDelete({
                    id: selectionRows.id
                  });
            },
            labelWidth: "170px",
            rules: {
            },
          }}
        ></base-table>
      </base-page-container>
    );
  }
});
</script>
<style scoped lang="scss"></style>
