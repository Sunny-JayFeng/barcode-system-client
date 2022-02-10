<!-- 出货单管理页面 -->
<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-condition">
      <el-form :inline="true" :model="queryCondition">
        <el-form-item label="订单创建人：">
          <el-input v-model="queryCondition.createUserName" placeholder="根据订单创建人查询"></el-input>
        </el-form-item>
        <el-form-item label="客户名称：">
          <el-input v-model="queryCondition.customerName" placeholder="根据客户名称查询"></el-input>
        </el-form-item>
        <el-form-item label="料号：">
          <el-input v-model="queryCondition.proMaterialNumber" placeholder="根据料号查询"></el-input>
        </el-form-item>
        <el-form-item label="型号：">
          <el-input v-model="queryCondition.proModel" placeholder="根据型号查询"></el-input>
        </el-form-item>
        <el-form-item label="批号：">
          <el-input v-model="queryCondition.lotNumber" placeholder="根据批号查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findGoodsOrderPage">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="goodsOrderData" border style="width: 80%">
        <el-table-column prop="createUserName" label="订单创建人" label-width="150"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" label-width="120"></el-table-column>
        <el-table-column prop="proMaterialNumber" label="料号" label-width="120"></el-table-column>
        <el-table-column prop="proModel" label="型号" label-width="120"></el-table-column>
        <el-table-column prop="amount" label="数量" label-width="300"></el-table-column>
        <el-table-column prop="goodsOrderNumber" label="出货单号" label-width="300"></el-table-column>
        <el-table-column prop="status" label="状态" label-width="300">
          <template slot-scope="scope">
            <span v-if="status === 0">未出货</span>
            <span v-else>已出货</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="300"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" label-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showGoodsOrderDetail(scope.goodsOrderNumber)">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="queryCondition.pageSize"
          :current-page="queryCondition.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :total="queryCondition.total">
        </el-pagination>
      </div>
    </div>
    <!-- 出货单明细弹出框 -->
    <div class="goods-order-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="dialog.title"
        :visible.sync="dialog.showDialog"
        width="70%">
        <el-table :data="stocksData" border style="width: 60%">
          <el-table-column prop="proMaterialNumber" label="产品料号" width="120"></el-table-column>
          <el-table-column prop="proModel" label="产品型号" width="120"></el-table-column>
          <el-table-column prop="lotNumber" label="批号" width="120"></el-table-column>
          <el-table-column prop="amount" label="数量" label-width="120"></el-table-column>
          <el-table-column prop="type" label="库存类型" label-width="300">
            <template slot-scope="scope">
              <span v-if="type === 0">袋</span>
              <span v-else-if="type === 1">盒</span>
              <span v-else-if="type === 2">箱</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="库存状态" label-width="300">
            <template slot-scope="scope">
              <span v-if="status === 0">在库</span>
              <span v-else-if="status === 1">待出库</span>
              <span v-else-if="status === 2">已出库</span>
              <span v-else-if="status === 3">不良品待销毁</span>
            </template>
          </el-table-column>
          <el-table-column prop="goodsOrderNumber" label="出货单号" label-width="300"></el-table-column>
          <el-table-column prop="isPackBox" label="是否拼盒" label-width="300">
            <template slot-scope="scope">
              <span v-if="isPackBox === 0">否</span>
              <span v-else-if="isPackBox === 1">是</span>
            </template>
          </el-table-column>
          <el-table-column prop="packBoxNumber" label="拼盒编号" label-width="300"></el-table-column>
          <el-table-column prop="isPackCase" label="是否拼箱" label-width="300">
            <template slot-scope="scope">
              <span v-if="isPackCase === 0">否</span>
              <span v-else-if="isPackCase === 1">是</span>
            </template>
          </el-table-column>
          <el-table-column prop="packCaseNumber" label="拼箱编号" label-width="300"></el-table-column>
          <el-table-column prop="wareCode" label="所在仓库编码" label-width="300"></el-table-column>
          <el-table-column prop="wareName" label="所在仓库名称" label-width="300"></el-table-column>
          <el-table-column prop="shelfCode" label="所在货架编码" label-width="300"></el-table-column>
          <el-table-column prop="inTime" label="入库日期" label-width="300"></el-table-column>
          <el-table-column prop="serialNumber" label="序列号" label-width="300"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" label-width="300"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import goodsOrderService from '../services/goodsOrderService'
import stockService from '../services/stockService'
export default {
  name: 'GoodsOrder',
  data () {
    return {
      goodsOrderData: [],
      stocksData: [],
      goodsOrder: null,
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        createUserName: '',
        customerName: '',
        proMaterialNumber: '',
        proModel: '',
        lotNumber: ''
      },
      createGoodsOrderParams: {
        customerName: '',
        proMaterialNumber: '',
        proModel: '',
        amount: 0
      },
      dialog: {
        title: '',
        showDialog: false,
        formLabelWidth: '155px'
      }
    }
  },
  created () {
    this.findGoodsOrderPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findGoodsOrderPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findGoodsOrderPage()
    },
    showGoodsOrderDetail (orderNumber) {
      // 根据单号查询库存信息
      stockService.findByGoodsOrderNumber(orderNumber).then(response => {
        console.log(response)
      })
    },
    findGoodsOrderPage () {
      goodsOrderService.findGoodsOrderPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findGoodsOrderPageInfo
          this.queryCondition.total = pageInfo.total
          this.goodsOrderData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    findStockToCreateOrder () {
      goodsOrderService.findStockToCreateOrder(this.queryCondition).then(response => {
        console.log(response)
      })
    },
    lockStockToCreateOrder (stockId) {
      goodsOrderService.lockStockToCreateOrder(stockId).then(response => {
        console.log(response)
      })
    },
    unLockStockOfCreateOrder (stockId) {
      goodsOrderService.unLockStockOfCreateOrder(stockId).then(response => {
        console.log(response)
      })
    },
    unLockGoodsOrderStock (stockId) {
      goodsOrderService.unLockGoodsORderStock(stockId).then(response => {
        console.log(response)
      })
    },
    createGoodsOrder () {
      goodsOrderService.createGoodsOrder(this.createGOodsOrderParams).then(response => {
        console.log(response)
      })
    },
    confirmOutStock () {
      goodsOrderService.confirmOutStock().then(response => {
        console.log(response)
      })
    }
  }
}
</script>

<style scoped>
@import '../assets/style/goodsOrder.css';
@import '../assets/style/reset.css';
</style>
