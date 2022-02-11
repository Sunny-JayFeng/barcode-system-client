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
        <el-table-column label="是否打印定制标签" label-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.haveCustomerLabel === 0" style="color: #ff0000">否</span>
            <span v-else-if="scope.row.haveCustomerLabel === 1" style="color: #32CD32">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="120"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" label-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="editCustomer(scope.row)">编辑</el-button>
            <el-button type="text" size="medium" @click="handleDeleteCustomer(scope.row)">删除</el-button>
            <el-button :disabled="scope.row.haveCustomerLabel === 0" type="text" size="medium" @click="showPrintCustomerLabelDialog(scope.row)">打印定制标签</el-button>
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
          <el-form-item label="是否有定制标签：" prop="haveCustomerLabel" :label-width="dialog.formLabelWidth">
            <template>
              <el-radio v-model="customer.haveCustomerLabel" :label="0">否</el-radio>
              <el-radio v-model="customer.haveCustomerLabel" :label="1">是</el-radio>
            </template>
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
    <!-- 客户定制标签弹出框 -->
    <div class="customer-label-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="customerLabelDialog.title"
        :visible.sync="customerLabelDialog.showDialog"
        width="40%">
        <el-form :model="customerLabelBo" :rules="customerLabelRules" ref="customerLabel">
          <el-row>
            <el-col :span="11">
              <el-form-item label="客户名称：" prop="customerName" :label-width="customerLabelDialog.formLabelWidth">
                <el-input disabled v-model="customerLabelBo.customerName" style="width: 220px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="公司名称：" prop="companyName" :label-width="customerLabelDialog.formLabelWidth">
                <el-input v-model="customerLabelBo.companyName" style="width: 220px;" placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="料号：" prop="proMaterialNumber" :label-width="customerLabelDialog.formLabelWidth">
                <el-input v-model="customerLabelBo.proMaterialNumber" style="width: 220px;" placeholder="请输入料号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="型号：" prop="proModel" :label-width="customerLabelDialog.formLabelWidth">
                <el-input v-model="customerLabelBo.proModel" style="width: 220px;" placeholder="请输入型号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="批号：" prop="lotNumber" :label-width="customerLabelDialog.formLabelWidth">
                <el-input v-model="customerLabelBo.lotNumber" style="width: 220px;" placeholder="请输入批号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="数量：" prop="amount" :label-width="customerLabelDialog.formLabelWidth">
                <el-input type="number" min="0" v-model="customerLabelBo.amount" style="width: 90px;" placeholder="请输入数量"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="序列号：" prop="serialNumber" :label-width="customerLabelDialog.formLabelWidth">
                <el-input v-model="customerLabelBo.serialNumber" style="width: 220px;" placeholder="请输入序列号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="地址：" prop="address" :label-width="customerLabelDialog.formLabelWidth">
                <el-input v-model="customerLabelBo.address" style="width: 220px;" placeholder="请输入地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="打印张数：" prop="total" :label-width="customerLabelDialog.formLabelWidth">
                <el-input type="number" min="1" v-model="customerLabelBo.total" style="width: 80px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dialog-footer">
            <el-button @click="resetCustomerLabel">取 消</el-button>
            <el-button type="primary" @click="confirmPrintCustomerLabel">打印</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import customerService from '../services/customerService'
import customerLabelService from '../services/customerLabelService'
export default {
  name: 'Customer',
  data () {
    return {
      customerData: [],
      customer: {
        customerName: '',
        address: '',
        phone: '',
        haveCustomerLabel: 0, // 是否有定制标签
        password: '' // 为了能够进行属性校验
      },
      customerLabelBo: {
        customerName: '',
        companyName: '',
        proMaterialNumber: '',
        proModel: '',
        lotNumber: '',
        amount: 0,
        serialNumber: '',
        address: '',
        total: 1 // 打印数量
      },
      customerRules: {
        customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '客户地址不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '客户电话不能为空', trigger: 'blur' }],
        haveCustomerLabel: [{ required: true, message: '是否有定制标签不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '仓库管理员密码不能为空', trigger: 'blur' }]
      },
      customerLabelRules: {
        customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
        proMaterialNumber: [{ required: true, message: '料号不能为空', trigger: 'blur' }],
        proModel: [{ required: true, message: '型号不能为空', trigger: 'blur' }],
        lotNumber: [{ required: true, message: '批号不能为空', trigger: 'blur' }],
        amount: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
        serialNumber: [{ required: true, message: '序列号不能为空', trigger: 'blur' }]
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
      },
      customerLabelDialog: {
        title: '客户定制标签打印',
        showDialog: false,
        formLabelWidth: '133px'
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
    showPrintCustomerLabelDialog (customer) {
      this.customerLabelBo.customerName = customer.customerName
      this.customerLabelDialog.showDialog = true
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
    confirmPrintCustomerLabel () {
      this.$refs['customerLabel'].validate((valid) => {
        if (valid) {
          this.printCustomerLabel()
        }
      })
    },
    printCustomerLabel () {
      customerLabelService.printCustomerLabel(this.customerLabelBo).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('打印任务已提交')
          this.findCustomerPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
        this.resetCustomerLabel()
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
        haveCustomerLabel: 0, // 是否有定制标签
        password: '' // 为了能够进行属性校验
      }
    },
    // 重置定制标签信息
    resetCustomerLabel () {
      this.customerLabelDialog.showDialog = false
      this.$refs['customerLabel'].resetFields()
      this.customerLabelBo = {
        customerName: '',
        companyName: '',
        proMaterialNumber: '',
        proModel: '',
        lotNumber: '',
        amount: 0,
        serialNumber: '',
        address: '',
        total: 1 // 打印数量
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/style/customer.css';
@import '../assets/style/reset.css';
</style>
