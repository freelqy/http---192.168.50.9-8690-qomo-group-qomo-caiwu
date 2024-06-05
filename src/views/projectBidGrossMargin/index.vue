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
  projectBidGrossMarginList,
  projectBidGrossMarginDeleteBatch,
  projectBidGrossMarginDelete,
  projectBidGrossMarginExportXls,
  genBidGrossMargin,
  projectBidGrossMarginAdd,
  projectBidGrossMarginEdit
} from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";
import {download} from "@qomo-platform/utils";

export default defineComponent({
  name: "projectBidGrossMargin",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const fluterDialogRef = ref(null);
    const exportDialogRef = ref(null)
    const columns = ref<BaseTableColumnType>([
      { type: "selection",fixed:true },
      { type: "index",fixed:true,label: "序号",width:60 },
      { label: "业务板块", prop: "businessSegment",fixed:true },
      { label: "主项目号", prop: "masterProCode" },
      { label: "主项目名称", prop: "masterProName", hideInSearchForm: true },
      { label: "销售子项目号", prop: "saleSonProCode", hideInSearchForm: true },
      { label: "销售子项目名称", prop: "saleSonProName", hideInSearchForm: true },
      {
        label: "投标毛利率",
        prop: "bidGrossMargin",
        hideInSearchForm: true
      },
      {
        label: "降本后毛利率",
        prop: "costReductionGrossMargin",
        hideInSearchForm: true
      },
      {
        label: "创建时间",
        prop: "createTime",
        hideInSearchForm: true,
        hideInAddOrEditForm:true
      },
      {
        label: "创建人",
        prop: "createBy",
        hideInSearchForm: true,
        hideInAddOrEditForm:true
      },
      {
        label: "最后修改时间",
        prop: "updateTime",
        hideInSearchForm: true,
        hideInAddOrEditForm:true
      },
      {
        label: "修改人",
        prop: "updateBy",
        hideInSearchForm: true,
        hideInAddOrEditForm:true
      },
      {
        type: "operation",
        width:150,
        label: "操作",
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
              { key: "preview", label: "查看", onClick: () => doPreview(row) },
              { key: "delete", label: "删除", onClick: () => doDeleteRows(row) }
            ]}
          />
        )
      }
    ]);

    expose(exposeDialogArgs);

    const getFluterOpen = () => {
      fluterDialogRef.value.open();
    };

    const handleOK = async (model)=>{
        await genBidGrossMargin(model)
        tableRef.value.doReload()
       // return false
    }

    const handlEexportOK = async (model)=>{
      const response = await projectBidGrossMarginExportXls({
        ...model
      });
      download(response, `投标预测毛利率.xlsx`);
       // return false
    }

    const exportXls = async () => {
      exportDialogRef.value.open()
     
    };
    const renderForm = (model) => (
      <>
          <el-form-item label="年月："   prop="yearMonths">
            <el-date-picker
              value-format={"YYYY-MM"}
              v-model={model.yearMonths}
              type="month"
            />
          </el-form-item>
      </>
    );

    const renderExportForm = (model) => (
      <>
      <el-form-item label="业务板块："   prop="yearMonths">
            <el-select
            />
          </el-form-item>
          <el-form-item label="项目投标年月："   prop="yearMonths">
            <el-date-picker
              value-format={"YYYY-MM"}
              v-model={model.yearMonths}
              type="month"
            />
          </el-form-item>
      </>
    );

    return () => (
      <base-page-container flex-hidden={true}>
        <base-dialog-form
          ref={fluterDialogRef}
          title={"获取投标预测毛利率"}
          width={400}
          rules={{
            yearMonths: [{required: true, message: "请选择预测年月", trigger: "blur"}],
           }}
          confirm={handleOK}
          v-slots={{
            default: ({model}) => renderForm(model),
          }}
        />
        <base-dialog-form
          ref={exportDialogRef}
          title={"导出"}
          width={400}
          rules={{
            yearMonths: [{required: true, message: "请选择预测年月", trigger: "blur"}],
           }}
          confirm={handlEexportOK}
          v-slots={{
            default: ({model}) => renderExportForm(model),
          }}
        />
        <base-table
          ref={tableRef}
          autoCalculateWidth
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                {/* <BaseTableToolbarButton type="primary" onClick={doAddOrEdit}>
                  新增
                </BaseTableToolbarButton> */}
                <BaseTableToolbarButton type="primary" onClick={getFluterOpen}>
                  获取投标毛利率
                </BaseTableToolbarButton>
                <BaseTableToolbarButton type="primary" onClick={exportXls}>
                  导出
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
              await projectBidGrossMarginList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onAddOrEdit(data) {
              data?.id ? await projectBidGrossMarginEdit(data) :
              await projectBidGrossMarginAdd(data)
            },
            //删除数据
            async onDeleteRows(selectionRows) {
              Array.isArray(selectionRows)
                ? await projectBidGrossMarginDeleteBatch({
                    ids: selectionRows.map(item => item.id).join(",")
                  })
                : await projectBidGrossMarginDelete({
                    id: selectionRows.id
                  });
            },
            labelWidth: "170px",
            rules: {
              appId: false,
              accessKey: false,
              secretKey: false,
              languageResource: false,
              remark: false,
            },
          }}
        ></base-table>
      </base-page-container>
    );
  }
});
</script>
<style scoped lang="scss"></style>
