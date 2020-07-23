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
      <el-button size="mini" type="primary" style="float:right;" @click="batchDelete">批量删除</el-button>
      <el-button size="mini" type="primary" style="float:right;" @click="insert">新增</el-button>

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
        <el-table-column prop="type" label="游戏名称" width="150px" />
        <el-table-column prop="areaId" label="游戏区服" />
        <el-table-column prop="avgPrice" label="商品平均单价" />
        <el-table-column prop="amount" label="销售总金额" />
        <el-table-column prop="sales" label="销售数量" />
        <el-table-column fixed="right" label="操作" width="140" class-name="column-sousa">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteDetail(scope.row.id)">删除</el-button>
            <i>|</i>
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

    <el-drawer
      :visible.sync="showDrawer"
      direction="rtl"
      size="30%"
    >
      <div slot="title" class="title">
        <div class="top-bar">
          <h5 class="title">{{ drawerTitle }}</h5>
        </div>
      </div>
      <el-form
        ref="orderForm"
        :model="orderForm"
        label-position="right"
        class="ali-form clearfix"
        style="margin-right: 3.1em;margin-top: -1.6em;"
      >
        <el-form-item label="游戏名称" required>
          <el-cascader v-model="orderForm.name" :options="typeList" clearable :show-all-levels="false" />
        </el-form-item>
        <el-form-item label="游戏区服" required>
          <el-cascader v-model="orderForm.area" :options="typeSelectList" clearable :show-all-levels="false" />
        </el-form-item>
        <el-form-item label="购买数量" required>
          <el-input v-model="orderForm.number" placeholder="购买数量" />
        </el-form-item>
        <el-form-item label="单价" required>
          <el-input v-model="orderForm.price" placeholder="购买价格" />
        </el-form-item>
        <el-form-item label="应付款金额" disabled>
          <el-input v-model="orderForm.total" placeholder="应付款金额" />
        </el-form-item>
        <!-- <el-form-item label="商品图片" required>
          <el-input placeholder="商品图片" />
        </el-form-item> -->

      </el-form>
      <div class="bottom-bar" />
      <div class="bottom-group">
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import '../../styles/fixed.scss'
import { fetchAllCoinList, fetchPageCoinList, fetchDeleteData, fetchBatchDeleteData } from '@/api/coin'
import { fetchAllTypeList, fetchTypeList } from '@/api/type'
import { fetchAllAreaListData } from '@/api/area'

export default {
  data() {
    return {
      typeSelectList: [],
      areaList: [],
      drawerTitle: '',
      selectIds: [],
      showDrawer: false,
      total: 0,
      typeList: [],
      tableData: [],
      selectItem: [],
      currentPage: 0,
      pageSize: 0,
      pages: 0,
      form: {

      },
      orderForm: {
        name: '',
        area: '',
        number: '',
        price: '',
        total: ''
        // pic: ''
      },
      listQuery: {
        page: 1,
        rows: 10
      }
    }
  },
  computed: {

  },
  created() {
    this.fetchAllTypeList()
    this.fetchAllAreaList()
    this.getCoinPageListData()
  },
  methods: {
    handleSelectionChange: function(selection) {
      var t = []
      for (var i in selection) {
        t.push(selection[i].id)
      }
      this.selectIds = t
      this.selectItem = selection
    },
    checkStatus: function() {
      const that = this
      let status = 0
      that.selectItem.forEach(val => {
        status++
      })
      console.log(status)
      return status
    },
    batchDelete() {
      var that = this
      that.checkStatus()
      if (that.selectIds.length > 0) {
        this.$confirm('共选择' + that.selectIds.length + '条数据，是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchBatchDeleteData(that.selectIds).then((val) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getCoinPageListData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$notify({ type: 'warning', title: '操作提醒', message: '至少选择一条数据' })
      }
    },
    handleSizeChange(val) {
      this.listQuery.rows = val
      this.getCoinPageListData()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getCoinPageListData()
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
        // if (val.mode === 1) {
        //   val.mode = '邮寄'
        // } else if (val.mode === 2) {
        //   val.mode = '在线交易'
        // }
        that.typeList.forEach(index => {
          if (index.id === val.type) {
            val.type = index.name
          }
        })
        that.areaList.forEach(index => {
          index.forEach(item => {
            // eslint-disable-next-line eqeqeq
            if (val.areaId == item.id) {
              val.areaId = item.areaName
            }
          })
        })
      })
      this.tableData = data
    },
    async fetchAllTypeList() {
      const { data } = await fetchAllTypeList()
      data.forEach(val => {
        const obj = {
          value: val.name,
          label: val.name
        }
        this.typeList.push(obj)
      })
      console.log(this.typeList)
      const val = await fetchTypeList()
      this.typeSelectList = val.data
    },
    deleteDetail(data) {
      fetchDeleteData(data).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getCoinPageListData()
      })
    },
    showDetail(data) {
      this.drawerTitle = '订单详情'
      this.showDrawer = true
    },
    insert() {
      this.drawerTitle = '订单新增'
      this.showDrawer = true
    },
    save() {
      console.log(this.orderForm)
    },
    fetchAllAreaList() {
      const that = this
      fetchAllAreaListData().then(val => {
        that.areaList.push(val.data)
      })
    }
  }
}
</script>

<style>
  .el-message-box__btns .el-button:nth-child(2){
    background: #409EFF;
  }
  .el-message-box__btns .el-button:nth-child(2):hover{
    background: #76BAFF;
    color: white;
  }
</style>

