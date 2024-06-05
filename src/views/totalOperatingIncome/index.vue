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
  totalOperatingIncomeList,
  totalOperatingIncomeDelete,
  totalOperatingIncomeDeleteBatch,
  totalOperatingIncomeForecast
} from "@/api/index";
import { transformPageResponse,disabledPreviousMonths } from "@/utils/qomo";
import _ from "lodash";
import { download } from "@qomo-platform/utils";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "totalOperatingCost",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const forecastDialogRef = ref(null);
    const router = useRouter();

    const columns = ref<BaseTableColumnType>([
      { type: "selection", fixed: true },
      { type: "index", fixed: true, label: "序号", width: 60 },
      { label: "预测月份", prop: "forecastMonth", fixed: true },
      { label: "预测版本", prop: "forecastVersion",render:({row})=><span>V{row?.forecastVersion}</span> },
      { label: "创建时间", prop: "createTime", valueType: "date" },
      { label: "创建人", prop: "createBy" },
      {
        label: "营业总收入（元）",
        prop: "totalSalesRevenue",
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
              { key: "preview", label: "查看", onClick: () =>{
                router.push({ path:`/latestMonthSch`,query:{
                  forecastMonth:row?.forecastMonth
                }});
                
              } }
            ]}
          />
        )
      }
    ]);

    expose(exposeDialogArgs);

    const forecastOpen = () => {
      forecastDialogRef.value.open();
    };

    const handleOK = async (model) => {
      await totalOperatingIncomeForecast(model)
      tableRef.value.doReload()
    };
    const renderForm = (model) => (
      <>
        <el-form-item
            label="预测年月："
            prop="forecastMonth"
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
        <base-dialog-form
          ref={forecastDialogRef}
          title={"预测"}
          width={400}
          rules={{
            forecastMonth: [{required: true, message: "请选择预测年月", trigger: "blur"}],
           }}
          confirm={handleOK}
          v-slots={{
            default: ({model}) => renderForm(model),
          }}
        />
        <base-table
          ref={tableRef}
          autoCalculateWidth
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton type="primary" onClick={forecastOpen}>
                  预测总收入
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
              await totalOperatingIncomeList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onDeleteRows(selectionRows) {
              Array.isArray(selectionRows)
                ? await totalOperatingIncomeDeleteBatch({
                    ids: selectionRows.map(item => item.id).join(",")
                  })
                : await totalOperatingIncomeDelete({
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
