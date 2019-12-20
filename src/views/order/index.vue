<template>
  <div class="app-container">
    <div class="form search">
      <label class="form-item">
        <span>游戏类型：</span>
        <el-select v-model="form.orgName" placeholder="游戏类型" />
      </label>
      <label class="form-item">
        <span>所在大区：</span>
        <el-input v-model="form.resourceName" placeholder="所在大区" />
      </label>

      <el-button size="mini" type="primary">查询</el-button>
      <el-button size="mini">重置</el-button>
      <el-button size="mini" type="primary" style="float:right;">数据初始化</el-button>

    </div>
    <div class="table-wrapper">
      <el-table
        ref="collectTable"
        :data="tableData"
        style="width: 100%"
        header-row-class-name="table-header"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" class-name="column-check" />
        <el-table-column prop="id" label="编号" width="100px" />
        <el-table-column prop="type" label="游戏类型" width="150px" />
        <el-table-column prop="area" label="所在大区" />
        <el-table-column prop="mode" label="购买方式" />
        <el-table-column prop="quantity" label="购买数量" />
        <el-table-column prop="amount" label="应付款金额" />
        <el-table-column fixed="right" label="操作" width="60" class-name="column-sousa">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import '../../styles/fixed.scss'
import { fetchAllCoinList, fetchPageCoinList } from '@/api/coin'
import { fetchAllTypeList } from '@/api/type'

export default {
  data() {
    return {
      total: 0,
      typeList: [],
      tableData: [],
      selectItem: [],
      currentPage: 0,
      pageSize: 0,
      pages: 0,
      form: {

      },
      listQuery: {
        page: 1,
        rows: 10
      }
    }
  },
  created() {
    this.fetchAllTypeList()
    this.getCoinPageListData()
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.rows = val
      this.getCoinPageListData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getCoinPageListData()
    },
    handleSelectionChange: function(val) {
      this.selectItem = val
    },
    getCoinPageListData() {
      fetchPageCoinList(this.listQuery).then(data => {
        this.tableData = data.data.list
        this.currentPage = data.data.pageNum
        this.pageSize = data.data.pageSize
        this.pages = data.data.pages
        this.total = data.data.total
        this.dealAllTable(this.tableData)
      })
    },
    async getCoinAllListData() {
      const { data } = await fetchAllCoinList()
      this.dealAllTable(data)
      this.total = data.length
    },
    dealAllTable(data) {
      const that = this
      data.forEach(val => {
        if (val.mode === 1) {
          val.mode = '邮寄'
        } else if (val.mode === 2) {
          val.mode = '在线交易'
        }
        that.typeList.forEach(index => {
          if (index.id === val.type) {
            val.type = index.name
          }
        })
      })
      this.tableData = data
    },
    async fetchAllTypeList() {
      const { data } = await fetchAllTypeList()
      this.typeList = data
    }
  }
}
</script>

<style scoped>

</style>

