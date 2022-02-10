<!-- 仓库管理页面 -->
<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-condition">
      <el-form :inline="true" :model="queryCondition">
        <el-form-item label="仓库编码：">
          <el-input v-model="queryCondition.wareCode" placeholder="根据仓库编码查询"></el-input>
        </el-form-item>
        <el-form-item label="仓库名称：">
          <el-input v-model="queryCondition.wareName" placeholder="根据仓库名称查询"></el-input>
        </el-form-item>
        <el-form-item label="仓库管理员名称：">
          <el-input v-model="queryCondition.manager" placeholder="根据仓库管理员名称查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findWarehousePage">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="add-warehouse-btn">
      <el-button type="primary" size="medium" @click="showAddWarehouseDialog">添加仓库</el-button>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="warehouseData" border style="width: 80%">
        <el-table-column prop="wareCode" label="仓库编码" label-width="150"></el-table-column>
        <el-table-column prop="wareName" label="仓库名称" label-width="120"></el-table-column>
        <el-table-column prop="manager" label="仓库管理员" label-width="120"></el-table-column>
        <el-table-column prop="warehouseQrCode" label="仓库二维码" label-width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="120"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" label-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="showEditWarehouseDialog(scope.row)">修改仓库信息</el-button>
            <el-button type="text" size="medium" @click="handleDeleteWarehouse(scope.row)">删除仓库信息</el-button>
            <el-button type="text" size="medium" @click="printWarehouseLabel(scope.row)">打印仓库标签</el-button>
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
    <!-- 仓库信息弹出框 -->
    <div class="warehouse-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="dialog.title"
        :visible.sync="dialog.showDialog"
        width="30%">
        <el-form :model="warehouse" :rules="warehouseRules" ref="warehouse">
          <el-form-item label="仓库编码：" prop="wareCode" :label-width="dialog.formLabelWidth">
            <el-input :disabled="isUpdate" v-model="warehouse.wareCode" style="width: 300px" placeholder="请输入仓库编码"></el-input>
          </el-form-item>
          <el-form-item label="仓库名称：" prop="wareName" :label-width="dialog.formLabelWidth">
            <el-input :disabled="isUpdate" v-model="warehouse.wareName" style="width: 300px" placeholder="请输入仓库名称"></el-input>
          </el-form-item>
          <el-form-item label="仓库管理员：" prop="manager" :label-width="dialog.formLabelWidth">
            <el-select style="width: 190px" v-model="warehouse.manager" placeholder="请选择仓库管理员">
              <el-option v-for="(item, index) in userData" :key="index" :label="item.userName" :value="item.userName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前账号的密码：" prop="manager" :label-width="dialog.formLabelWidth">
            <el-input v-model="warehouse.password" style="width: 300px" placeholder="请输入当前账号的密码"></el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="resetWarehouse">取 消</el-button>
            <el-button v-if="isUpdate" type="primary" @click="confirmAddWarehouse">确定修改</el-button>
            <el-button v-else type="primary" @click="confirmAddWarehouse">确定新增</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import warehouseService from '../services/warehouseService'
import userService from '../services/userService'
export default {
  name: 'Warehouse',
  data () {
    return {
      warehouseData: [],
      userData: [],
      warehouse: {
        wareCode: '',
        wareName: '',
        manager: '',
        password: '' // 当前登录的账号的密码
      },
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        wareCode: '',
        wareName: '',
        manager: ''
      },
      warehouseRules: {
        wareCode: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
        wareName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
        manager: [{ required: true, message: '仓库管理员不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '当前登录的密码不能为空', trigger: 'blur' }]
      },
      isUpdate: false,
      dialog: {
        title: '',
        showDialog: false,
        formLabelWidth: '155px'
      }
    }
  },
  created () {
    this.findWarehousePage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findWarehousePage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findWarehousePage()
    },
    showEditWarehouseDialog (warehouse) {
      this.isUpdate = true
      this.findWarehouseManager()
      this.warehouse = warehouse
      this.dialog.title = '修改仓库管理员'
      this.dialog.showDialog = true
    },
    handleDeleteWarehouse (warehouse) {
      this.$prompt('请输入登录密码:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.warehouse = warehouse
        this.warehouse['password'] = value
        this.deleteWarehouse()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    showAddWarehouseDialog () {
      this.isUpdate = false
      this.findWarehouseManager()
      this.dialog.title = '新增仓库'
      this.dialog.showDialog = true
    },
    findWarehousePage () {
      warehouseService.findWarehousePage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findWarehousePageInfo
          this.queryCondition.total = pageInfo.total
          this.warehouseData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    // 查找仓库管理员
    findWarehouseManager () {
      userService.findUserByRole(1).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.userData = responseData.findUserByRoleInfo
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    confirmAddWarehouse () {
      this.$refs['warehouse'].validate((valid) => {
        if (valid) {
          if (this.isUpdate) this.updateWarehouse()
          else this.addWarehouse()
        }
      })
    },
    addWarehouse () {
      warehouseService.addWarehouse(this.warehouse, this.warehouse.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('添加成功')
          this.findWarehousePage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    updateWarehouse () {
      warehouseService.updateWarehouse(this.warehouse, this.warehouse.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('修改成功')
          this.findWarehousePage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    deleteWarehouse () {
      warehouseService.deleteWarehouse(this.warehouse, this.warehouse.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('删除成功')
          this.findWarehousePage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    printWarehouseLabel (warehouse) {
      warehouseService.printWarehouseLabel(warehouse).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('仓库标签打印任务已提交')
          this.findWarehousePage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    resetWarehouse () {
      this.dialog.showDialog = false
      this.$refs['warehouse'].resetFields()
      this.warehouse = {
        wareCode: '',
        wareName: '',
        manager: '',
        password: '' // 当前登录的账号的密码
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/style/warehouse.css';
@import '../assets/style/reset.css';
</style>
