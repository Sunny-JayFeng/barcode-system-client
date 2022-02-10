<!-- 库存管理页面 -->
<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-condition">
      <el-form :inline="true" :model="queryCondition">
        <el-row>
          <el-col :span="4">
            <el-form-item label="料号：">
              <el-input v-model="queryCondition.proMaterialNumber" placeholder="根据料号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="型号：">
              <el-input v-model="queryCondition.proModel" placeholder="根据型号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="批号：">
              <el-input v-model="queryCondition.lotNumber" placeholder="根据批号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="库存类型">
              <el-select style="width: 190px" v-model="queryCondition.type" placeholder="根据库存类型查询">
                <el-option label="全选" value="undefined"></el-option>
                <el-option label="真空袋" value="0"></el-option>
                <el-option label="盒" value="1"></el-option>
                <el-option label="箱" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="库存状态">
              <el-select style="width: 190px" v-model="queryCondition.status" placeholder="根据库存状态查询">
                <el-option label="全选" value="undefined"></el-option>
                <el-option label="在库" value="0"></el-option>
                <el-option label="待出库" value="1"></el-option>
                <el-option label="已出库" value="2"></el-option>
                <el-option label="不良品待销毁" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="出货单号：">
              <el-input v-model="queryCondition.shipmentNumber" placeholder="根据出货单号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="拼盒编号：">
              <el-input v-model="queryCondition.packBoxNumber" placeholder="根据拼盒编号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="拼箱编号：">
              <el-input v-model="queryCondition.packCaseNumber" placeholder="根据拼箱编号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="findStockPage">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="stockData" border style="width: 80%">
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
  </div>
</template>
<script>
import stockService from '../services/stockService'
export default {
  name: 'Stock',
  data () {
    return {
      stockData: [],
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        proMaterialNumber: '',
        proModel: '',
        lotNumber: '',
        shipmentNumber: '',
        packBoxNumber: '',
        packCaseNumber: '',
        type: undefined,
        status: undefined
      }
    }
  },
  created () {
    this.findStockPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findStockPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findStockPage()
    },
    findStockPage () {
      stockService.findStockPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findStockPageInfo
          this.queryCondition.total = pageInfo.total
          this.stockData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    findByGoodsOrderNumber (goodsOrderNumber) {
      stockService.findByGOodsOrderNumber(goodsOrderNumber).then(response => {
        console.log(response)
      })
    }
  }
}
</script>

<style scoped>
@import '../assets/style/stock.css';
@import '../assets/style/reset.css';
</style>
