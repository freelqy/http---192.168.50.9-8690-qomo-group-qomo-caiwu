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
import { receivableAgeList } from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";

export default defineComponent({
  name: "receivableAgeActualDesc",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);

    const columns = ref<BaseTableColumnType>([
      { type: "selection", fixed: true },
      { type: "index", fixed: true, label: "序号", width: 60 },
      { label: "公司代码", prop: "companyCode" },
      { label: "过账日期", prop: "masterProName", hideInSearchForm: true },
      { label: "凭证类型", prop: "saleSonProCode", hideInSearchForm: true },
      { label: "凭证编号", prop: "saleSonProName", hideInSearchForm: true },
      {
        label: "客户编码",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "客户名称",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "总账科目",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "总账金额",
        prop: "wbsCode",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "凭证货币",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "文本",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "本币",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "本币金额",
        prop: "wbsCode",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "付款基准日期",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "取SAP基准日",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "报表日期",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "付款条件",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "到期日期",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "逾期天数",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "未到期应收",
        prop: "salesRevenue",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "逾期年限",
        prop: "wbsCode",
        hideInSearchForm: true
      }
    ]);

    expose(exposeDialogArgs);

    return () => (
      <base-page-container flex-hidden={true}>
        <base-table
          ref={tableRef}
          toolbar={{ layout: "search-dnamic,reload,column-setting,fullscreen" }}
          auto-height
          autoCalculateWidth
          columns={columns.value}
          request={async ({
            pageSize = 10,
            current = 1,
            ...otherSearchParams
          }) => {
            return transformPageResponse(
              await receivableAgeList({
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
