<!-- 客户管理页面 -->
<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-condition">
      <el-form :inline="true" :model="queryCondition">
        <el-form-item label="客户名称：">
          <el-input v-model="queryCondition.customerName" placeholder="根据客户名称查询"></el-input>
        </el-form-item>
        <el-form-item label="客户地址：">
          <el-input v-model="queryCondition.address" placeholder="根据客户地址查询"></el-input>
        </el-form-item>
        <el-form-item label="客户电话：">
          <el-input v-model="queryCondition.phone" placeholder="根据客户电话查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findCustomerPage">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="add-customer-btn">
      <el-button type="primary" size="medium" @click="showAddCustomerDialog">添加客户</el-button>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="customerData" border style="width: 80%">
        <el-table-column prop="customerName" label="客户名称" label-width="150"></el-table-column>
        <el-table-column prop="address" label="客户地址" label-width="120"></el-table-column>
        <el-table-column prop="phone" label="客户电话" label-width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="120"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" label-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="editCustomer(scope.row)">编辑</el-button>
            <el-button type="text" size="medium" @click="handleDeleteCustomer(scope.row)">删除</el-button>
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
    <!-- 客户信息弹出框 -->
    <div class="customer-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="dialog.title"
        :visible.sync="dialog.showDialog"
        width="30%">
        <el-form :model="customer" :rules="customerRules" ref="customer">
          <el-form-item label="客户名称：" prop="customerName" :label-width="dialog.formLabelWidth">
            <el-input v-model="customer.customerName" style="width: 300px;" placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item label="客户地址：" prop="address" :label-width="dialog.formLabelWidth">
            <el-input v-model="customer.address" style="width: 300px;" placeholder="请输入客户地址"></el-input>
          </el-form-item>
          <el-form-item label="客户电话：" prop="phone" :label-width="dialog.formLabelWidth">
            <el-input v-model="customer.phone" style="width: 300px;" placeholder="请输入客户电话"></el-input>
          </el-form-item>
          <el-form-item v-show="isUpdate" label="仓库管理员密码：" prop="password" :label-width="dialog.formLabelWidth">
            <el-input v-model="customer.password" style="width: 300px;" placeholder="请输入仓库管理员密码"></el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="resetCustomer">取 消</el-button>
            <el-button v-if="isUpdate" type="primary" @click="confirmAddCustomer">确定修改</el-button>
            <el-button v-else type="primary" @click="confirmAddCustomer">确定新增</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import customerService from '../services/customerService'
export default {
  name: 'Customer',
  data () {
    return {
      customerData: [],
      customer: {
        customerName: '',
        address: '',
        phone: '',
        password: '' // 为了能够进行属性校验
      },
      customerRules: {
        customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '客户地址不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '客户电话不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '仓库管理员密码不能为空', trigger: 'blur' }]
      },
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        customerName: '',
        address: '',
        phone: ''
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
    this.findCustomerPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findCustomerPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findCustomerPage()
    },
    showAddCustomerDialog () {
      this.dialog.title = '新增客户信息'
      this.isUpdate = false
      this.customer.password = 'temp' // 新增客户不需要管理员密码
      this.dialog.showDialog = true
    },
    editCustomer (customer) {
      this.dialog.title = '修改客户信息'
      this.isUpdate = true
      this.customer = customer
      this.dialog.showDialog = true
    },
    handleDeleteCustomer (customer) {
      this.$prompt('请输入登录密码:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.customer = customer
        this.customer['password'] = value
        this.deleteCustomer()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    findCustomerPage () {
      customerService.findCustomerPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findCustomerPagesInfo
          this.queryCondition.total = pageInfo.total
          this.customerData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    addCustomer () {
      customerService.addCustomer(this.customer).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('新增成功')
          this.findCustomerPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
        this.resetCustomer()
      })
    },
    deleteCustomer () {
      console.log(this.customer)
      customerService.deleteCustomer(this.customer, this.customer.password).then(response => {
        console.log(response)
        this.customer.password = ''
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('删除成功')
          this.findCustomerPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    updateCustomer () {
      customerService.updateCustomer(this.customer, this.customer.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('修改成功')
          this.findCustomerPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
        this.resetCustomer()
      })
    },
    confirmAddCustomer () {
      this.$refs['customer'].validate((valid) => {
        if (valid) {
          if (this.isUpdate) this.updateCustomer()
          else this.addCustomer()
        }
      })
    },
    // 重置客户信息
    resetCustomer () {
      this.dialog.showDialog = false
      this.$refs['customer'].resetFields()
      this.customer = {
        customerName: '',
        address: '',
        phone: '',
        password: '' // 为了能够进行属性校验
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/style/customer.css';
@import '../assets/style/reset.css';
</style>
