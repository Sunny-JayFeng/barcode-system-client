<!-- 库存操作日志管理页面 -->
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
            <el-form-item label="操作人：">
              <el-input style="width: 150px" v-model="queryCondition.operator" placeholder="根据操作人查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="操作类型：" style="margin-left: -80px">
              <el-select style="width: 170px;" v-model="queryCondition.operationType" placeholder="根据操作类型查询">
                <el-option label="全选" value="undefined"></el-option>
                <el-option label="出货" value="0"></el-option>
                <el-option label="入库" value="1"></el-option>
                <el-option label="出库" value="2"></el-option>
                <el-option label="上架" value="3"></el-option>
                <el-option label="下架" value="4"></el-option>
                <el-option label="变更货架" value="5"></el-option>
                <el-option label="变更仓库" value="6"></el-option>
                <el-option label="拼盒" value="7"></el-option>
                <el-option label="拼箱" value="8"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="出货单号：" style="margin-left: -125px">
              <el-input v-model="queryCondition.shipmentNumber" placeholder="根据出货单号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="拼盒编号：" style="margin-left: -135px">
              <el-input v-model="queryCondition.packBoxNumber" placeholder="根据拼盒编号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="拼箱编号：" style="margin-left: -145px">
              <el-input v-model="queryCondition.packCaseNumber" placeholder="根据拼箱编号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item style="margin-left: -150px">
              <el-button type="primary" @click="findStockLogPage">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="stockLogData" border style="width: 80%">
        <el-table-column prop="stockId" label="库存id" label-width="150"></el-table-column>
        <el-table-column prop="proMaterialNumber" label="产品料号" label-width="150"></el-table-column>
        <el-table-column prop="proModel" label="产品型号" label-width="120"></el-table-column>
        <el-table-column prop="lotNumber" label="批号" label-width="120"></el-table-column>
        <el-table-column prop="amount" label="数量" label-width="120"></el-table-column>
        <el-table-column prop="type" label="库存类型" label-width="300">
          <template slot-scope="scope">
            <span v-if="type === 0">袋</span>
            <span v-else-if="type === 1">盒</span>
            <span v-else-if="type === 2">箱</span>
          </template>
        </el-table-column>
        <el-table-column prop="operationType" label="操作类型" label-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.operationType === 0">出货</span>
            <span v-if="scope.row.operationType === 1">出库</span>
            <span v-if="scope.row.operationType === 2">入库</span>
            <span v-if="scope.row.operationType === 3">上架</span>
            <span v-if="scope.row.operationType === 4">下架</span>
            <span v-if="scope.row.operationType === 5">变更货架</span>
            <span v-if="scope.row.operationType === 6">变更仓库</span>
            <span v-if="scope.row.operationType === 7">拼盒</span>
            <span v-if="scope.row.operationType === 8">拼箱</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" label-width="100"></el-table-column>
        <el-table-column prop="goodsOrderNumber" label="出货单号" label-width="300"></el-table-column>
        <el-table-column prop="packBoxNumber" label="拼盒编号" label-width="300"></el-table-column>
        <el-table-column prop="packCaseNumber" label="拼箱编号" label-width="300"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="300"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" label-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
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
  </div>
</template>
<script>
import stockLogService from '../services/stockLogService'
export default {
  name: 'StockLog',
  data () {
    return {
      stockLogData: [],
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        proMaterialNumber: '',
        proModel: '',
        lotNumber: '',
        operator: '',
        shipmentNumber: '',
        packBoxNumber: '',
        packCaseNumber: '',
        type: undefined,
        status: undefined,
        operationType: undefined
      }
    }
  },
  created () {
    this.findStockLogPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findStockLogPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findStockLogPage()
    },
    findStockLogPage () {
      stockLogService.findStockLogPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findStockLogPageInfo
          this.queryCondition.total = pageInfo.total
          this.stockLogData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    }
  }
}
</script>

<style scoped>
@import '../assets/style/stockLog.css';
@import '../assets/style/reset.css';
</style>
