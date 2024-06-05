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
  sectorGrossMarginList,
  invoicingBudgetMouthDelete,
  sectorGrossMarginDelete,
  sectorGrossMarginExportXls,
  genSectorGrossMargin
} from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";
import {download} from "@qomo-platform/utils";

export default defineComponent({
  name: "grossProfit",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const fluterDialogRef = ref(null);
    const form = reactive({
      yearMonths: ""
    });
    const columns = ref<BaseTableColumnType>([
      { type: "selection",fixed:true },
      { type: "index",fixed:true,label: "序号",width:60 },
      { label: "产品业务板块（产品大类)", prop: "businessSegments",fixed:true },
      { label: "主项目号", prop: "masterProCode" },
      { label: "主项目名称", prop: "masterProName", hideInSearchForm: true },
      { label: "销售子项目号", prop: "saleSonProCode", hideInSearchForm: true },
      { label: "销售子项目名称", prop: "saleSonProName", hideInSearchForm: true },
      {
        label: "产品板块毛利率（产品大类）",
        prop: "prodSegmentGrossMargin",
        hideInSearchForm: true
      },
      {
        label: "创建时间",
        prop: "createTime",
        hideInSearchForm: true
      },
      {
        label: "创建人",
        prop: "createBy",
        hideInSearchForm: true
      },
      {
        type: "operation",
        label: "操作",
        width: 120,
        render: ({ row, doAddOrEdit, doDeleteRows }) => (
          <base-table-operation
            btnList={[
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

    const handleOK = async ()=>{
        await genSectorGrossMargin(form)
        tableRef.value.doReload()
       // return false
    }

    const exportXls = async () => {
      const response = await sectorGrossMarginExportXls({
        ...form
      });
      download(response, `板块预测毛利率.xlsx`);
    };
    const renderForm = () => (
      <>
        <el-form model={form} labelWidth={"80px"}>
          <el-form-item label="年月：" required>
            <el-date-picker
              value-format={"YYYY-MM"}
              v-model={form.yearMonths}
              type="month"
            />
          </el-form-item>
        </el-form>
      </>
    );

    return () => (
      <base-page-container flex-hidden={true}>
        <base-dialog
          ref={fluterDialogRef}
          title={"获取板块预测毛利率"}
          width={400}
          confirm={handleOK}
          v-slots={{
            default: renderForm
          }}
        />
        <base-table
          ref={tableRef}
          autoCalculateWidth
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton type="primary" onClick={getFluterOpen}>
                  获取板块预测毛利率
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
              await sectorGrossMarginList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            //删除数据
            async onDeleteRows(selectionRows) {
              Array.isArray(selectionRows)
                ? await sectorGrossMarginDeleteBatch({
                    ids: selectionRows.map(item => item.id).join(",")
                  })
                : await sectorGrossMarginDelete({
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
