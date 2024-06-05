<template>
  <el-row style="margin-top: 10px;display: flex;justify-content: flex-end;">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <span class="h-8 leading-8 text-[#606266] text-sm mr-2 ml-[30px]">自定义分页大小</span>
    <el-input v-model="customPageSize" style="width:80px;" placeholder="请输入"
              @change="handleCustomPageSize"></el-input>
  </el-row>
</template>
<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['update:page', 'update:limit'])

const customPageSize = ref(undefined)

const props = defineProps({
  total: Number,
  page: Number,
  limit: Number,
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50, 100, 200]
    }
  }
})

const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})

const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})

const handleSizeChange = (val) => {
  emit('pagination', { page: props.currentPage, limit: val })
}

const handleCurrentChange = (val) => {
  emit('pagination', { page: val, limit: props.pageSize })
}

const handleCustomPageSize = (val) => {
  pageSize.value = val ? Number(val) : 10
}
</script>