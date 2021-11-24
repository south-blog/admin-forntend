<template>
  <Searchs
    :data="searchData"
    :handleSearch="handleSearch"
  />
  <Tables
    :data="tableData"
    :columns="tableColumns"
    :total="pageOptions.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { IRoleRequestData } from '@/types'
import Searchs from '@/components/Search.vue'
import Tables from '@/components/Table.vue'
import API from '@api/system/role'

type IQuery = Partial<IRoleRequestData> & IPageDate

export default defineComponent({
  name: 'SystemRole',
  components: {
    Searchs,
    Tables
  },
  setup() {
    // 表格数据
    const tableColumns = reactive<ITableColumns[]>([
      { label: 'ID', key: 'id', width: 180, isNotCreat: true },
      { label: '姓名', key: 'name', width: 180 },
      { label: '用户', key: 'auth_ids', width: 180 },
    ])
    // 搜索数据
    const searchData = ref<ISearchData[]>([])
    // 表格渲染数据
    const tableData = ref<IRoleRequestData[]>([])
    // 分页数据
    const pageOptions = reactive<Required<IPageDate>>({
      page: 1,
      pageSize: 20,
      total: 0
    })

    onMounted(() => {
      handleGetPage()
      handleGetSearch(tableColumns)
    })

    // 获取搜索数据
    const handleGetSearch = (columns: ITableColumns[]) => {
      const data: ISearchData[] = []
      columns.forEach(item => {
        if (item.isSearch) {
          const { label, key } = item
          data.push({ label, key })
        }
      })
      searchData.value = data
    }

    // 获取分页数据
    const handleGetPage = (query?: IQuery) => {
      API.find_page(query || pageOptions).then(response => {
        const res = response.data

        if (res.code === 200) {
          const { items, total } = res.data
          tableData.value = items
          pageOptions.total = total
        }
      })
    }

    // 搜索处理
    const handleSearch = (formData: IRoleRequestData) => {
      const params = {
        ...formData,
        page: pageOptions.page,
        pageSize: pageOptions.pageSize
      }
      handleGetPage(params)
    }
    
    const handleSizeChange = (val: number) => {
      console.log(`${val} items per page`)
    }
    const handleCurrentChange = (val: number) => {
      console.log(`current page: ${val}`)
    }

    return {
      searchData,
      tableData,
      tableColumns,
      pageOptions,
      handleSearch,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>
