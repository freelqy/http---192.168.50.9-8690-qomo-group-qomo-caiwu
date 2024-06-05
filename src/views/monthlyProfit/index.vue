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
  monthlyProfitList,
  costForecastDetailList,
  costForecastForecast,
  monthlyProfitDelete,
  costForecastListByYearMonth,
  costForecastDetailExportXls,
  totalOperatingCostListByYearMonth,
  totalOperatingIncomeListByYearMonth,
  monthlyProfitForecast,
  monthlyProfitDetailList,
  monthlyProfitSave,
  monthlyProfitQueryById
} from "@/api/index";
import { transformPageResponse, disabledPreviousMonths } from "@/utils/qomo";
import _ from "lodash";
import { useRoute, useRouter } from "vue-router";
import { download, getMonthBetween } from "@qomo-platform/utils";
import { ElMessage, dayjs } from "element-plus";

export default defineComponent({
  name: "monthlyProfit",
  setup(props, { attrs, expose, slots = {} }) {
    const { dialogRef, ...exposeDialogArgs } = useExposeDialogArgs();
    const tableRef = ref(null);
    const tableRefChild = ref(null);
    const fluterDialogRef = ref(null);
    const treeSelect = ref(null)
    const router = useRouter();
    const selectRow = ref(null);
    const checkedKeys = ref(null);
    const treeRefs = ref([]);
    const form = reactive({
      yearMonths: ""
    });
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
              row?.forecastState ?{
                key: "preview",
                label: "详情",
                onClick: () => {
                  router.push({ path:`monthlyProfitDesc/${row.id}`});
                  // descDialogRef.value.open();
                }
              }:{
                key: "yc",
                label: "预测",
                onClick: async () => {
                  //selectRow.value = row;
                  const data = await monthlyProfitQueryById({
                    id:row.id
                  })
                  fluterDialogRef.value.open()
                  setTimeout(async ()=>{
                    fluterDialogRef.value.form.setFormData(data)
                    await changeTime(data.forecastMonth)
                    ForecastData.value[0].versions = data.operatingIncomeIds.split(',').map(item=>+item)
                    ForecastData.value[1].versions = data.operatingCostIds.split(',').map(item=>+item)
                    ForecastData.value[2].versions = data.costIds.split(',').map(item=>+item)
                  })
                }
              }
            ]}
          />
        )
      }
    ]);

    const columnsForecast = ref<BaseTableColumnType>([
      { label: "利润过程项", prop: "gc" },
      {
        label: "执行",
        prop: "zx",
        width: 80,
        render: () => <el-button icon="RefreshRight" circle />
      },
      {
        label: "可用版本",
        prop: "ver",
        render: ({ row, index }) => (
          <el-tree-select
            v-model={row.versions}
            data={row.version}
            multiple
            filterable
            ref={treeSelect}
            onNodeClick={(nodeObj, treeStatus) =>
              handleCheck(nodeObj, treeStatus, row, index)
            }
            render-after-expand={false}
          />
        )
      }
    ]);

    const columnsChild = ref<BaseTableColumnType>([
      // { type: "selection", fixed: true },
      // { type: "index", fixed: true, label: "序号", width: 60 },
      { label: "项目", prop: "itemName", hideInSearchForm: true },
      {
        label: "业务板块",
        prop: "businessSegment",
        renderFormItem: ({ model }) => (
          <dict-select
            dictType="basic_business_type"
            v-model={model.businessSegment}
            type="month"
          />
        )
      },
      {
        label: "一月",
        prop: "m01",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "二月",
        prop: "m02",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "三月",
        prop: "m03",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "四月",
        prop: "m04",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "五月",
        prop: "m05",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "六月",
        prop: "m06",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "七月",
        prop: "m07",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "八月",
        prop: "m08",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "九月",
        prop: "m09",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "十月",
        prop: "m10",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "十一月",
        prop: "m11",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "十二月",
        prop: "m12",
        valueType: "amountThousands",
        hideInSearchForm: true
      },
      {
        label: "累加",
        prop: "total",
        valueType: "amountThousands",
        fixed: "right",
        hideInSearchForm: true
      }
    ]);

    expose(exposeDialogArgs);

    const handleCheck = (nodeObj, treeStatus, { id, version }, index) => {
      if (nodeObj?.children) {
        return false;
      } else {
        // 如果当前节点已经被选中，则取消其他同级节点的选中状态
        ForecastData.value[index - 1].validateVersion = {
          ...ForecastData.value[index - 1].validateVersion,
          [nodeObj.forecastMonth]: nodeObj.id
        };
        setTimeout(() => {
          ForecastData.value[index - 1].versions = Object.values(
            ForecastData.value[index - 1].validateVersion
          );
        });
      }
    };

    const getFluterOpen = () => {
      fluterDialogRef.value.open();
    };

    const handleOK = async model => {
      const isSave = ForecastData.value.find(item => !item.versions.length);
      const isV = ForecastData.value.find(
        item => item.validateVersionLength !== item.versions.length
      );
      if (isSave) {
        ElMessage.error("版本必须选择！");
        return false;
      } else if (isV) {
        ElMessage.error("每个月份的版本必须选择一个！");
        return false;
      }
      const data = {
        ...model,
        operatingIncomeIds: ForecastData.value[0].versions.join(","),
        operatingCostIds: ForecastData.value[1].versions.join(","),
        costIds: ForecastData.value[2].versions.join(","),
        forecastMonths: getMonthBetween(
          dayjs(new Date()).format("YYYY-MM"),
          model.forecastMonth
        ).join(",")
      };
      await monthlyProfitForecast(data);
      tableRef.value.doReload();
      // return false
    };

    // const exportXls = async () => {
    //   const response = await projectGrossMarginExportXls({
    //     ...form
    //   });
    //   download(response, `项目毛利率.xlsx`);
    // };

    const exportXlsChild = async () => {
      const response = await costForecastDetailExportXls({
        ...form
      });
      download(response, `费用预测明细.xlsx`);
    };

    const ForecastData = ref<BaseTableColumnType>([
      {
        gc: "1、 获取营业总收入",
        version: [],
        validateVersion: {},
        id: "sr"
      },
      {
        gc: "2、获取营业成本",
        validateVersion: {},
        version: [],
        id: "cb"
      },
      {
        gc: "3、获取费用",
        version: [],
        validateVersion: {},
        id: "fy"
      }
      // {
      //   gc: "4、获取预测月之前坏账计提"
      // }
    ]);

    const yearMonthTree = data => {
      const month = _.uniq(data.map(item => item.forecastMonth)).sort(
        (a, b) => a - b
      );
      const groupData = _.groupBy(
        data.map(item => ({
          ...item,
          label: `V${item.forecastVersion}_${item.createTime}`,
          value: item.id
        })),
        "forecastMonth"
      );

      const tree = month.map(item => {
        return {
          value: item,
          label: item,
          children: groupData[item]
        };
      });
      return tree;
    };

    const changeTime = async time => {
      if (time) {
        const data = getMonthBetween(dayjs(new Date()).format("YYYY-MM"), time);
        Promise.all([
          await totalOperatingIncomeListByYearMonth(data),
          await totalOperatingCostListByYearMonth(data),
          await costForecastListByYearMonth(data),
        ]).then(res => {
          ForecastData.value.forEach((item, index) => {
            ForecastData.value[index].validateVersionLength =  _.uniq(
              res[index].map(_item => _item.forecastMonth)
            ).sort((a, b) => a - b).length,
            ForecastData.value[index].version = yearMonthTree(res[index])
          });
        });
      }
    };

    const save = async model => {
      await fluterDialogRef.value.form?.validate?.();
      const data = {
        ...model,
        operatingIncomeIds: ForecastData.value[0].versions.join(","),
        operatingCostIds: ForecastData.value[1].versions.join(","),
        costIds: ForecastData.value[2].versions.join(","),
        forecastMonths: getMonthBetween(
          dayjs(new Date()).format("YYYY-MM"),
          model.forecastMonth
        ).join(",")
      };
      await monthlyProfitSave(data);
      fluterDialogRef.value.close()
      tableRef.value.doReload()
    };

    const renderFormfluter = model => (
      <>
        <el-form-item label="预测业务板块：" prop="businessSegment">
          <dict-select
            dictType="businessSegmentData"
            v-model={model.businessSegment}
            type="month"
          />
        </el-form-item>
        <el-form-item label="年月：" prop="forecastMonth">
          <el-date-picker
            value-format={"YYYY-MM"}
            v-model={model.forecastMonth}
            onChange={() => changeTime(model.forecastMonth)}
            disabled-date={disabledPreviousMonths}
            type="month"
          />
        </el-form-item>
        <el-form-item labelWidth="0px" class="flex">
          <base-page-container flex-hidden={true}>
            <base-table
              toolbar={false}
              pagination={false}
              search={false}
              auto-height
              columns={columnsForecast.value}
              request={async ({
                pageSize = 10,
                current = 1,
                ...otherSearchParams
              }) => {
                return {
                  data: ForecastData.value
                };
              }}
            ></base-table>
          </base-page-container>
        </el-form-item>
      </>
    );

    return () => (
      <base-page-container flex-hidden={true}>
        <base-dialog-form
          ref={fluterDialogRef}
          title={"获取预测"}
          confirmButtonText="开始预测"
          width={"40%"}
          rules={{
            forecastMonth: [
              { required: true, message: "请选择预测年月", trigger: "blur" }
            ],
            businessSegment: [
              { required: true, message: "请选择预测业务板块", trigger: "blur" }
            ]
          }}
          confirm={handleOK}
          v-slots={{
            default: ({ model }) => renderFormfluter(model),
            footer: ({ renderDefaultDom }, model) => (
              <>
                {renderDefaultDom?.()}
                <el-button type="primary" onClick={() => save(model)}>
                  暂存
                </el-button>
              </>
            )
          }}
        />
        <base-table
          ref={tableRef}
          autoCalculateWidth
          v-slots={{
            toolbar: ({ doAddOrEdit, selectionRows, doDeleteRows }) => (
              <el-space>
                <BaseTableToolbarButton type="primary" onClick={getFluterOpen}>
                  获取预测
                </BaseTableToolbarButton>
                {/* <BaseTableToolbarButton type="primary" onClick={getFluterOpen}>
                  导出
                </BaseTableToolbarButton> */}
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
              await monthlyProfitList({
                pageNo: current,
                pageSize,
                ...otherSearchParams
              })
            );
          }}
          curdConfig={{
            async onDeleteRows(selectionRows) {
              await monthlyProfitDelete({
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
