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
  badDebtProvisionList,
  badDebtProvisionAdd,
  badDebtProvisionDelete,
  badDebtProvisionDetailList,
  badDebtProvisionDetailDelete,
  badDebtProvisionDetailEdit
} from "@/api/index";
import { transformPageResponse, disabledMonthsReals } from "@/utils/qomo";
import _ from "lodash";
import { download } from "@qomo-platform/utils";

export default defineComponent({
  name: "badDebtProvision",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const tableRefChild = ref(null);
    const fluterDialogRef = ref(null);
    const descDialogRef = ref(null);
    const selectRow = ref(null);
    const tags = ref([]);
    const form = reactive({
      yearMonths: ""
    });
    const columns = ref<BaseTableColumnType>([
      { type: "index", fixed: true, label: "序号", width: 60 },
      { label: "报表日期", prop: "forecastMonth", valueType: "month" },
      {
        label: "应收账款坏账总额",
        prop: "totalAmount",
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
                  descDialogRef.value.open();
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
      { label: "公司", prop: "companyCode",hideInAddOrEditForm:true },
      { label: "坏账类型", prop: "badDebtType" },
      { label: "坏账项", prop: "badDebtItem" },
      { label: "公司名称/账龄", prop: "ageing", hideInSearchForm: true },
      { label: "应收账款余额", prop: "receivable", hideInSearchForm: true,  valueType: "amountThousands",hideInAddOrEditForm:true },
      {
        label: "坏账计提比例",
        prop: "badDebtTate",
        hideInSearchForm: true,hideInAddOrEditForm:true
      },
      {
        label: "坏账金额",
        prop: "badDebtAmount",
        valueType: "amountThousands",
        hideInSearchForm: true,hideInAddOrEditForm:true
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
                key: "edit",
                label: "修改",
                onClick: () =>
                  doAddOrEdit({
                    ...row
                  })
              }
            ]}
          />
        )
      }
    ]);

    expose(exposeDialogArgs);

    const getFluterOpen = () => {
      fluterDialogRef.value.open();
    };

    const handleOK = async model => {
      const dataFromt = {
        '03':'-31',
        '06':'-30',
        '09':'-30',
        '12':'-31'
      }
      const forecastMonth = `${model.forecastMonth}${dataFromt[model.forecastMonth.split('-')[1]]}`
      await badDebtProvisionAdd({
        forecastMonth
      });
      tableRef.value.doReload();
      // return false
    };

    // const exportXls = async () => {
    //   const response = await projectGrossMarginExportXls({
    //     ...form
    //   });
    //   download(response, `项目毛利率.xlsx`);
    // };

    // const exportXlsChild = async () => {
    //   const response = await costForecastDetailExportXls({
    //     ...form
    //   });
    //   download(response, `费用预测明细.xlsx`);
    // };

    const dataChange = val => {
      if (!tags.value.find(item => item === val)) {
        tags.value.push(val);
      }
    };

    const handleClose = (tag: string) => {
      fluterDialogRef.value.form.resetFormData()
      tags.value.splice(tags.value.indexOf(tag), 1);
    };

    const renderForm = () => (
      <div
        style={{
          height: "calc(100% - 600px)",
          overflow: "auto",
          display: "flex"
        }}
      >
        <base-page-container flex-hidden={true}>
          <base-table
            ref={tableRefChild}
            tableKey="tableKeyChildrens"
            autoCalculateWidth
            toolbar={{
              layout: "search-dnamic,reload,column-setting,fullscreen"
            }}
            auto-height
            columns={columnsChild.value}
            request={async ({
              pageSize = 10,
              current = 1,
              ...otherSearchParams
            }) => {
              return transformPageResponse(
                await badDebtProvisionDetailList({
                  pageNo: current,
                  pageSize,
                  ...otherSearchParams,
                  mainId: selectRow?.value?.id
                })
              );
            }}
            curdConfig={{
              async onAddOrEdit(data) {
              data?.id && await badDebtProvisionDetailEdit(data)
              },
              async onDeleteRows(selectionRows) {
                await badDebtProvisionDetailDelete({
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
        <el-form-item label="报表日期：" prop="forecastMonth">
          <el-date-picker
            value-format={"YYYY-MM"}
            v-model={model.forecastMonth}
            //onChange={dataChange}
            disabled-date={disabledMonthsReals}
            type="month"
          />
        </el-form-item>
        {/* <div class="flex gap-[5px]">
          {tags.value.map((item, index) => (
            <el-tag key={index} closable onClose={handleClose}>
              {item}
            </el-tag>
          ))}
        </div> */}
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
          title={"获取坏账计提"}
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
              await badDebtProvisionList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onDeleteRows(selectionRows) {
              await badDebtProvisionDelete({
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
