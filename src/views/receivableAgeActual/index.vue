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
import { receivableAgeActualList } from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";
import { download } from "@qomo-platform/utils";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "receivableAgeActual",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const router = useRouter();
    const columns = ref<BaseTableColumnType>([
      { type: "selection",prop:"selection1",fixed: true },
      { type: "index", prop:"index1",fixed: true, label: "序号", width: 60 },
      {
        label: "",
        prop: "test",
        // hideInSearchFilter:true,
        // hideInSearchForm:true,
        children: [
          { type: "selection", fixed: true },
          { type: "index", fixed: true, label: "序号", width: 60 },
          { label: "年月", prop: "yearMonths" },
          { label: "公司代码", prop: "companyCode" },
          { label: "客户编码", prop: "customerCode" },
          { label: "业务板块", prop: "businessSegment" },
          { label: "付款条件（账期）", prop: "paymentTerm" },
          { label: "会计科目", prop: "accountSubject" },
          { label: "报表日期", prop: "reportDate" }
        ]
      },
      {
        label: "月末实际账期",
        prop: "test1",
        align: "center",
        // hideInSearchFilter:true,
        // hideInSearchForm:true,
        children: [
          {
            label: "应收账款合计（本币金额)",
            prop: "total",
            valueType: "amountThousands"
          },
          {
            label: "未到期应收",
            prop: "unexpired",
            valueType: "amountThousands"
          },
          { label: "1年以内", prop: "oneYear", valueType: "amountThousands" },
          {
            label: "1年以上",
            prop: "overOneYear",
            valueType: "amountThousands"
          },
          {
            label: "2年以上",
            prop: "overTwoYear",
            valueType: "amountThousands"
          },
          {
            label: "3年以上",
            prop: "overThreeYear",
            valueType: "amountThousands"
          },
          {
            label: "4年以上",
            prop: "overFourYear",
            valueType: "amountThousands"
          },
          {
            label: "5年以上",
            prop: "overFiveYear",
            valueType: "amountThousands"
          }
        ]
      }
      // { label: "年月", prop: "yearMonths",hideInTable:true },
      // { label: "公司代码", prop: "companyCode",hideInTable:true },
      // { label: "客户编码", prop: "customerCode",hideInTable:true },
      // { label: "业务板块", prop: "businessSegment",hideInTable:true },
      // { label: "付款条件（账期）", prop: "paymentTerm",hideInTable:true },
      // { label: "会计科目", prop: "accountSubject",hideInTable:true },
      // { label: "报表日期", prop: "reportDate",hideInTable:true },
    ]);

    expose(exposeDialogArgs);

    return () => (
      <base-page-container flex-hidden={true}>
        <base-table
          ref={tableRef}
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton
                  type="primary"
                  onClick={() =>
                    router.push({ path: `receivableAgeActualDesc` })
                  }
                >
                  获取账龄明细
                </BaseTableToolbarButton>
              </el-space>
            )
          }}
          toolbar={{ layout: "search-dnamic,reload,column-setting,fullscreen" }}
          auto-height
          isMultiLevelHeader
          columns={columns.value}
          request={async ({
            pageSize = 10,
            current = 1,
            ...otherSearchParams
          }) => {
            debugger
            return transformPageResponse(
              await receivableAgeActualList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
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
