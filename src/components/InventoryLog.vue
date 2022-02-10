<!-- 盘点记录管理页面 -->
<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-condition">
      <el-form :inline="true" :model="queryCondition">
        <el-row>
          <el-col :span="3.5">
            <el-form-item label="料号：">
              <el-input v-model="queryCondition.proMaterialNumber" placeholder="根据料号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3.5">
            <el-form-item label="型号：">
              <el-input v-model="queryCondition.proModel" placeholder="根据型号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3.5">
            <el-form-item label="批号：">
              <el-input v-model="queryCondition.lotNumber" placeholder="根据批号查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3.5">
            <el-form-item label="仓库编码：">
              <el-input v-model="queryCondition.wareCode" placeholder="根据仓库编码查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3.5">
            <el-form-item label="货架编码：">
              <el-input v-model="queryCondition.shelfCode" placeholder="根据货架编码查询"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="是否有差异">
              <el-select v-model="queryCondition.different" placeholder="是否有差异">
                <el-option label="全选" value="undefined"></el-option>
                <el-option label="有差异" value="1"></el-option>
                <el-option label="无差异" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3.5">
            <el-form-item>
              <el-button type="primary" @click="findInventoryLogPage">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="inventoryLogData" border style="width: 80%">
        <el-table-column prop="stockId" label="库存id" label-width="120"></el-table-column>
        <el-table-column prop="proMaterialNumber" label="料号" label-width="120"></el-table-column>
        <el-table-column prop="proModel" label="型号" label-width="120"></el-table-column>
        <el-table-column prop="lotNumber" label="批号" label-width="120"></el-table-column>
        <el-table-column prop="realAmount" label="实际数量" label-width="120"></el-table-column>
        <el-table-column prop="qrCodeAmount" label="二维码上标的数量" label-width="120"></el-table-column>
        <el-table-column prop="different" label="是否有差异" label-width="120">
          <template slot-scope="scope">
            <span v-if="different === 0">否</span>
            <span v-else-if="different === 1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="amountDifference" label="差异数量" label-width="120"></el-table-column>
        <el-table-column prop="wareCode" label="仓库编码" label-width="120"></el-table-column>
        <el-table-column prop="wareName" label="仓库名称" label-width="120"></el-table-column>
        <el-table-column prop="shelfCode" label="货架编码" label-width="120"></el-table-column>
        <el-table-column prop="shelfName" label="货架名称" label-width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="120"></el-table-column>
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
import inventoryLogService from '../services/inventoryLogService'
export default {
  name: 'InventoryLog',
  data () {
    return {
      inventoryLogData: [],
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        proMaterialNumber: '',
        proModel: '',
        lotNumber: '',
        wareCode: '',
        shelfCode: '',
        different: undefined // 是否有差异
      }
    }
  },
  created () {
    this.findInventoryLogPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findInventoryLogPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findInventoryLogPage()
    },
    findInventoryLogPage () {
      inventoryLogService.findInventoryLogPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findInventoryLogPageInfo
          this.queryCondition.total = pageInfo.total
          this.inventoryLogData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    }
  }
}
</script>

<style scoped>
@import '../assets/style/inventoryLog.css';
@import '../assets/style/reset.css';
</style>
