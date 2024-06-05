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
  projectGrossMarginList,
  cumulativeListList,
  projectGrossMarginExportXls,
  projectGrossMarginChildExportXls
} from "@/api/index";
import { transformPageResponse } from "@/utils/qomo";
import _ from "lodash";
import {download} from "@qomo-platform/utils";
import { fa } from "element-plus/es/locale";

export default defineComponent({
  name: "projectGross",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const tableRefChild = ref(null);
    const fluterDialogRef = ref(null);
    const form = reactive({
      yearMonths: ""
    });
    const columns = ref<BaseTableColumnType>([
      { type: "selection",fixed:true },
      { type: "index",fixed:true,label: "序号",width:60 },
      { label: "公司代码", prop: "companyCode" },
      { label: "主项目名称", prop: "masterProName",sortable:'custom',extraProps:{
           customStr:'*{value}*',
         
      }, },
      { label: "销售子项目号", prop: "saleSonProCode",extraProps:{
           customStr:'*{value}*'
      }  },
      { label: "销售子项目名称", prop: "saleSonProName", hideInSearchForm: true },
      {
        label: "累计销售收入",
        prop: "cumulativeSalesRevenue",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "累计7525成本",
        prop: "cumulativeCost7525",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "累计毛利率",
        prop: "cumulativeGrossMargin",
        hideInSearchForm: true
      },
      // {
      //   label: "创建时间",
      //   prop: "createTime",
      //   hideInSearchForm: true
      // }
    ]);


    const columnsChild = ref<BaseTableColumnType>([
      { type: "selection",fixed:true },
      { type: "index",fixed:true,label: "序号",width:60 },
      { label: "公司代码", prop: "companyCode" },
      { label: "主项目名称", prop: "masterProName", hideInSearchForm: true},
      { label: "销售子项目号", prop: "saleSonProCode", hideInSearchForm: true},
      { label: "销售子项目名称", prop: "saleSonProName", hideInSearchForm: true },
      {
        label: "WBS号",
        prop: "wbsCode",
        hideInSearchForm: true
      },
      {
        label: "累计销售收入",
        prop: "salesRevenue",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "累计7525成本",
        prop: "cost7525",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "累计毛利率",
        prop: "grossMargin",
        hideInSearchForm: true
      },
      {
        label: "创建时间",
        prop: "createTime",
        hideInSearchForm: true
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
      const response = await projectGrossMarginExportXls({
        ...form
      });
      download(response, `项目毛利率.xlsx`);
    };

    const exportXlsChild = async () => {
      const response = await projectGrossMarginChildExportXls({
        ...form
      });
      download(response, `项目毛利率明细.xlsx`);
    };

    
    const renderForm = () => (
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
              await projectGrossMarginList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
        ></base-table>
      </base-page-container>
    );

    return () => (
      <base-page-container flex-hidden={true}>
        <base-dialog
          ref={fluterDialogRef}
          title={"明细"}
          width={'85%'}
          confirm={handleOK}
          v-slots={{
            default: renderForm
          }}
        />
        <base-table
          ref={tableRef}
          defaultSortFileds={
           {  label:"prders",
            ascending:'asc',
            descending:'desc'}
          }
          autoCalculateWidth
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton type="primary" onClick={getFluterOpen}>
                  查看明细
                </BaseTableToolbarButton>
                <BaseTableToolbarButton type="primary" onClick={exportXls}>
                  导出
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
            customData,
            ...otherSearchParams
          }) => {
            return transformPageResponse(
              await cumulativeListList({
                pageNo: current,
                pageSize,
                ...otherSearchParams,
                ...customData || {}
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
