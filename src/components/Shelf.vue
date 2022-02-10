<!-- 货架管理页面 -->
<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-condition">
      <el-form :inline="true" :model="queryCondition">
        <el-form-item label="货架编码：">
          <el-input v-model="queryCondition.shelfCode" placeholder="根据货架编码查询"></el-input>
        </el-form-item>
        <el-form-item label="仓库名称：">
          <el-input v-model="queryCondition.wareName" placeholder="根据仓库名称查询"></el-input>
        </el-form-item>
        <el-form-item label="货架类型：">
          <el-select style="width: 190px" v-model="queryCondition.shelfType" placeholder="根据货架类型查询">
            <el-option label="全选" :value="undefined"></el-option>
            <el-option label="真空袋货架" :value="0"></el-option>
            <el-option label="盒货架" :value="1"></el-option>
            <el-option label="箱货架" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findShelfPage">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="add-shelf-btn">
      <el-button type="primary" size="medium" @click="showAddShelfDialog">添加货架</el-button>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="shelfData" border style="width: 80%">
        <el-table-column align="center" prop="shelfCode" label="货架编码" width="150px"></el-table-column>
        <el-table-column align="center" prop="shelfType" label="货架类型" width="120px">
          <template slot-scope="scope">
            <span v-if="scope.row.shelfType === 0">袋货架</span>
            <span v-if="scope.row.shelfType === 1">盒货架</span>
            <span v-if="scope.row.shelfType === 2">箱货架</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="shelfNumber" label="货架编号" width="80px"></el-table-column>
        <el-table-column align="center" prop="shelfQrCode" label="货架二维码" width="210px"></el-table-column>
        <el-table-column align="center" prop="wareCode" label="所在仓库编码" width="140px"></el-table-column>
        <el-table-column align="center" prop="wareName" label="所在仓库名称" width="140px"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间" width="210px"></el-table-column>
        <el-table-column align="center" prop="updateTime" label="修改时间" width="210px"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" label-width="300">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="showEditShelfDialog(scope.row)">修改货架信息</el-button>
            <el-button type="text" size="medium" @click="handleDeleteShelf(scope.row)">删除货架信息</el-button>
            <el-button type="text" size="medium" @click="printShelfLabel(scope.row)">打印货架标签</el-button>
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
    <!-- 货架信息弹出框 -->
    <div class="shelf-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="dialog.title"
        :visible.sync="dialog.showDialog"
        width="30%">
        <el-form :model="shelf" :rules="shelfRules" ref="shelf">
          <el-form-item label="仓库名称：" prop="wareName" :label-width="dialog.formLabelWidth">
            <el-select @change="handleWareNameChange" value-key="wareCode" style="width: 190px" v-model="shelf.wareName" placeholder="请选择仓库名称">
              <el-option v-for="item in warehouseData" :key="item.wareCode" :label="item.wareName" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="仓库编码：" prop="wareCode" :label-width="dialog.formLabelWidth">
            <el-input disabled v-model="shelf.wareCode" style="width: 300px;" ></el-input>
          </el-form-item>
          <el-form-item label="货架类型：" prop="shelfType" :label-width="dialog.formLabelWidth">
            <el-select @change="handleShelfTypeChange" style="width: 300px" v-model="shelf.shelfType" placeholder="选择货架类型">
              <el-option label="真空袋货架" :value="0"></el-option>
              <el-option label="盒货架" :value="1"></el-option>
              <el-option label="箱货架" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货架编码：" prop="shelfCode" :label-width="dialog.formLabelWidth">
            <el-input disabled v-model="shelf.shelfCode" style="width: 300px;" ></el-input>
          </el-form-item>
          <el-form-item label="当前账号的密码：" prop="password" :label-width="dialog.formLabelWidth">
            <el-input v-model="shelf.password" style="width: 300px;" placeholder="请输入当前账号的密码"></el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="resetShelf">取 消</el-button>
            <el-button v-if="isUpdate" type="primary" @click="confirmUpdateOrAddShelf">确定修改</el-button>
            <el-button v-else type="primary" @click="confirmUpdateOrAddShelf">确定新增</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import shelfService from '../services/shelfService'
import warehouseService from '../services/warehouseService'
export default {
  name: 'Shelf',
  data () {
    return {
      shelfData: [],
      warehouseData: [],
      selectedWarehouse: {},
      shelf: {
        id: undefined,
        shelfCode: '',
        shelfType: undefined,
        wareCode: '',
        wareName: '',
        password: '' // 为了能够进行属性校验
      },
      isUpdate: false,
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        shelfCode: '',
        wareName: '',
        shelfType: undefined
      },
      shelfRules: {
        shelfCode: [{ required: true, message: '货架编码不能为空', trigger: 'blur' }],
        shelfType: [{ required: true, message: '货架类型不能为空', trigger: 'blur' }],
        wareCode: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
        wareName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '当前账号的密码不能为空', trigger: 'blur' }]
      },
      dialog: {
        title: '',
        showDialog: false,
        formLabelWidth: '155px'
      }
    }
  },
  created () {
    this.findShelfPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findShelfPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findShelfPage()
    },
    handleWareNameChange (value) {
      this.shelf.wareName = value.wareName
      this.shelf.wareCode = value.wareCode
      this.findShelfNumberByWareCode()
    },
    handleShelfTypeChange () {
      this.findShelfNumberByWareCode()
    },
    // 拼接货架编码
    handleShelfCode (shelfNumber) {
      console.log(this.shelf.shelfType)
      let shelfCode = 'S-' + this.shelf.wareCode + '-'
      if (this.shelf.shelfType === 0) shelfCode += 'D-'
      else if (this.shelf.shelfType === 1) shelfCode += 'H-'
      else if (this.shelf.shelfType === 2) shelfCode += 'X-'
      shelfCode += (shelfNumber + 1)
      this.shelf.shelfCode = shelfCode
    },
    findShelfPage () {
      shelfService.findShelfPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findShelfPageInfo
          this.queryCondition.total = pageInfo.total
          this.shelfData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    findWarehouse () {
      warehouseService.findWarehouse().then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.warehouseData = responseData.findWarehouseInfo
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    findShelfNumberByWareCode () {
      if (this.shelf.wareCode === '' || this.shelf.shelfType === undefined) return
      shelfService.findShelfNumberByWareCode(this.shelf.wareCode).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.handleShelfCode(responseData.findShelfNumberByWareCodeInfo)
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    showAddShelfDialog () {
      this.dialog.title = '新增货架'
      this.isUpdate = false
      this.findWarehouse()
      this.dialog.showDialog = true
    },
    showEditShelfDialog (shelf) {
      this.dialog.title = '修改货架信息'
      this.isUpdate = true
      this.shelf = shelf
      this.findWarehouse()
      this.dialog.showDialog = true
    },
    handleDeleteShelf (shelf) {
      this.$prompt('请输入登录密码:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.shelf = shelf
        this.shelf['password'] = value
        this.deleteShelf()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    confirmUpdateOrAddShelf () {
      this.$refs['shelf'].validate((valid) => {
        if (valid) {
          if (this.isUpdate) this.updateShelf()
          else this.addShelf()
        }
      })
    },
    addShelf () {
      shelfService.addShelf(this.shelf, this.shelf.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('添加成功')
          this.findShelfPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    updateShelf () {
      shelfService.updateShelf(this.shelf, this.shelf.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('修改成功')
          this.findShelfPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    deleteShelf () {
      shelfService.deleteShelf(this.shelf, this.shelf.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('删除成功')
          this.findShelfPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    printShelfLabel (shelf) {
      shelfService.printShelfLabel(shelf).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('货架标签打印任务已提交')
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    resetShelf () {
      this.dialog.showDialog = false
      this.$refs['shelf'].resetFields()
      this.shelf = {
        id: undefined,
        shelfCode: '',
        shelfType: undefined,
        wareCode: '',
        wareName: '',
        password: '' // 为了能够进行属性校验
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/style/shelf.css';
@import '../assets/style/reset.css';
</style>
