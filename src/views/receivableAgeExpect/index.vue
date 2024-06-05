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
  receivableAgeExpectList,
} from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";
import { download } from "@qomo-platform/utils";
import { useRoute, useRouter } from "vue-router";


export default defineComponent({
  name: "receivableAgeExpect",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const router = useRouter();
    
    const columns = ref<BaseTableColumnType>([
      {
        label:"",
        prop: "test" ,
        children:[
         { type: "selection",fixed:true },
         { type: "index",fixed:true,label: "序号",width:60 },
         { label: "年月", prop: "yearMonths" },
         { label: "公司代码", prop: "companyCode" },
         { label: "客户编码", prop: "customerCode" },
         { label: "业务板块", prop: "businessSegment" },
         { label: "付款条件（账期）", prop: "paymentTerm" },
         { label: "会计科目", prop: "accountSubject" },
         { label: "报表日期", prop: "reportDate" },
        ]
      },
      {
        label:"月初账期",
        prop: "test1" ,
        align:'center',
        children:[
         { label: "应收账款合计（本币金额)", prop: "monthlyTotal",valueType: "amountThousands"  },
         { label: "未到期应收", prop: "monthlyUnexpired",valueType: "amountThousands"  },
         { label: "1年以内", prop: "monthlyOneYear",valueType: "amountThousands"  },
         { label: "1年以上", prop: "monthlyOverOneYear",valueType: "amountThousands"  },
         { label: "2年以上", prop: "monthlyOverTwoYear",valueType: "amountThousands"  },
         { label: "3年以上", prop: "monthlyOverThreeYear",valueType: "amountThousands"  },
         { label: "4年以上", prop: "monthlyOverFourYear",valueType: "amountThousands"  },
         { label: "5年以上", prop: "monthlyOverFiveYear",valueType: "amountThousands"  },
        ]
      },
      {
        label:"本月变动",
        prop: "test2" ,
        align:'center',
        children:[
         { label: "新增应收", prop: "newReceivable",valueType: "amountThousands"  },
         { label: "计划回款", prop: "plannedReturn",valueType: "amountThousands"  },
        ]
      },
      {
        label:"预计账期",
        prop: "test3" ,
        align:'center',
        children:[
         { label: "应收账款合计", prop: "expectTotal",valueType: "amountThousands" },
         { label: "未到期应收", prop: "expectUnexpired",valueType: "amountThousands" },
         { label: "1年以内", prop: "expectOneYear",valueType: "amountThousands" },
         { label: "1年以上", prop: "expectOverOneYear",valueType: "amountThousands"  },
         { label: "2年以上", prop: "expectOverTwoYear",valueType: "amountThousands"  },
         { label: "3年以上", prop: "expectOverThreeYear",valueType: "amountThousands"  },
         { label: "4年以上", prop: "expectOverFourYear",valueType: "amountThousands"  },
         { label: "5年以上", prop: "expectOverFiveYear",valueType: "amountThousands"  },
        ]
      },
    ]);

    expose(exposeDialogArgs);

    return () => (
      <base-page-container flex-hidden={true}>
        <base-table
          ref={tableRef}
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton type="primary" onClick={()=> router.push({ path:`receivableAgeActualDesc`})}>
                  获取账龄明细
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
              await receivableAgeExpectList({
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
