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
  profitDeviationAnalysisList,
  profitDeviationAnalysisDelete
} from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";
import { download } from "@qomo-platform/utils";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "profitDeviationAnalysis",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const router = useRouter();

    const columns = ref<BaseTableColumnType>([
      { type: "selection", fixed: true },
      { type: "index", fixed: true, label: "序号", width: 60 },
      { label: "预测业务板块", prop: "businessSegment" },
      { label: "预测月份", prop: "forecastMonth", valueType: "month" },
      {
        label: "预测版本",
        prop: "forecastVersion",
        render: ({ row }) => <span>V{row?.forecastVersion}</span>,
        hideInSearchForm: true,
        hideInSearchFilter: true
      },
      { label: "报表生成时间", prop: "createTime", valueType: "date" },
      { label: "创建人", prop: "createBy" },
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
                  router.push({ path:`profitDeviationAnalysisDesc/${row.id}`});
                }
              }
            ]}
          />
        )
      }
    ]);


    expose(exposeDialogArgs);


    return () => (
      <base-page-container flex-hidden={true}>
        <base-table
          ref={tableRef}
          autoCalculateWidth
          toolbar={{ layout: "search-dnamic,reload,column-setting,fullscreen" }}
          auto-height
          columns={columns.value}
          request={async ({
            pageSize = 10,
            current = 1,
            ...otherSearchParams
          }) => {
            return transformPageResponse(
              await profitDeviationAnalysisList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onDeleteRows(selectionRows) {
              await profitDeviationAnalysisDelete({
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
