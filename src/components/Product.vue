<!-- 产品管理页面 -->
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
            <el-form-item label="序列号：">
              <el-input v-model="queryCondition.serialNumber" placeholder="根据序列号查询"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="每盒标准数量：">
              <el-input v-model="queryCondition.boxStandardQuantity" placeholder="根据每盒标准数量查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item style="margin-left: -50px" label="每箱标准数量：">
              <el-input v-model="queryCondition.caseStandardQuantity" placeholder="根据每箱标准数量查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item style="margin-left: -110px">
              <el-button type="primary" @click="findProductsPage">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="add-product-btn">
      <el-button type="primary" size="medium" @click="showAddProductDialog">添加产品信息</el-button>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="productData" border style="width: 80%">
        <el-table-column prop="boxStandardQuantity" label="每盒标准数量" label-width="150"></el-table-column>
        <el-table-column prop="caseStandardQuantity" label="每箱标准数量" label-width="120"></el-table-column>
        <el-table-column prop="proMaterialNumber" label="产品料号" label-width="120"></el-table-column>
        <el-table-column prop="proModel" label="产品型号" label-width="120"></el-table-column>
        <el-table-column prop="serialNumber" label="产品序列号" label-width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="120"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" label-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="editProduct(scope.row)">编辑</el-button>
            <el-button type="text" size="medium" @click="handleDeleteProduct(scope.row)">删除</el-button>
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
    <!-- 产品信息弹出框 -->
    <div class="product-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="dialog.title"
        :visible.sync="dialog.showDialog"
        width="30%">
        <el-form :model="product" :rules="productRules" ref="product">
          <el-form-item label="产品料号：" prop="proMaterialNumber" :label-width="dialog.formLabelWidth">
            <el-input :disabled="isUpdate" v-model="product.proMaterialNumber" style="width: 300px;" placeholder="请输入产品料号"></el-input>
          </el-form-item>
          <el-form-item label="产品型号：" prop="proModel" :label-width="dialog.formLabelWidth">
            <el-input :disabled="isUpdate" v-model="product.proModel" style="width: 300px;" placeholder="请输入产品型号"></el-input>
          </el-form-item>
          <el-form-item label="每盒标准数量：" prop="boxStandardQuantity" :label-width="dialog.formLabelWidth">
            <el-input v-model="product.boxStandardQuantity" style="width: 300px;" placeholder="请输入每盒标准数量"></el-input>
          </el-form-item>
          <el-form-item label="每箱标准数量：" prop="caseStandardQuantity" :label-width="dialog.formLabelWidth">
            <el-input v-model="product.caseStandardQuantity" style="width: 300px;" placeholder="请输入每箱标准数量"></el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="resetProduct">取 消</el-button>
            <el-button v-if="isUpdate" type="primary" @click="confirmUpdateOrAddProduct">确定修改</el-button>
            <el-button v-else type="primary" @click="confirmUpdateOrAddProduct">确定新增</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import productService from '../services/productService'
export default {
  name: 'Product',
  data () {
    return {
      productData: [],
      product: {
        productId: undefined,
        proMaterialNumber: '',
        proModel: '',
        boxStandardQuantity: undefined,
        caseStandardQuantity: undefined
      },
      password: '',
      isUpdate: false, // 是否为修改
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        proMaterialNumber: '',
        proModel: '',
        lotNumber: '',
        serialNumber: '',
        boxStandardQuantity: undefined,
        caseStandardQuantity: undefined
      },
      productRules: {
        proMaterialNumber: [{ required: true, message: '产品料号不能为空', trigger: 'blur' }],
        proModel: [{ required: true, message: '产品型号不能为空', trigger: 'blur' }],
        boxStandardQuantity: [{ required: true, message: '每盒标准数量不能为空', trigger: 'blur' }],
        caseStandardQuantity: [{ required: true, message: '每箱标准数量不能为空', trigger: 'blur' }]
      },
      dialog: {
        title: '',
        showDialog: false,
        formLabelWidth: '155px'
      }
    }
  },
  created () {
    this.findProductsPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findProductsPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findProductsPage()
    },
    editProduct (product) {
      this.isUpdate = true
      this.product = product
      this.dialog.title = '修改标准数量信息'
      this.dialog.showDialog = true
    },
    findProductsPage () {
      productService.findProductsPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findProductsPageInfo
          this.queryCondition.total = pageInfo.total
          this.productData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    showAddProductDialog () {
      this.isUpdate = false
      if (this.isUpdate) this.dialog.title = '修改产品信息'
      else this.dialog.title = '新增产品信息'
      this.dialog.showDialog = true
    },
    confirmUpdateOrAddProduct () {
      this.$refs['product'].validate((valid) => {
        if (valid) {
          if (this.isUpdate) this.updateProduct()
          else this.addProduct()
        }
      })
    },
    handleDeleteProduct (product) {
      this.$prompt('请输入登录密码:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.product = product
        this.password = value
        this.deleteProduct()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    updateProduct () {
      productService.updateProduct(this.product).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('修改成功')
          this.findCustomerPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
        this.resetProduct()
      })
    },
    addProduct () {
      productService.addProduct(this.product).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('新增成功')
          this.findCustomerPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
        this.resetProduct()
      })
    },
    deleteProduct () {
      productService.deleteProduct(this.product, this.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('删除成功')
          this.findCustomerPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    resetProduct () {
      this.dialog.showDialog = false
      this.$refs['product'].resetFields()
      this.product = {
        productId: undefined,
        proMaterialNumber: '',
        proModel: '',
        boxStandardQuantity: undefined,
        caseStandardQuantity: undefined
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/style/product.css';
@import '../assets/style/reset.css';
</style>
