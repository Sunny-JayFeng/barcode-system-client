<!-- 短信服务密钥管理页面 -->
<template>
  <div class="container">
    <!-- 按钮 -->
    <div class="add-access-key-btn">
      <el-button type="primary" size="medium" @click="showAddAccessKeyDialog">添加密钥</el-button>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="accessKeyData" border style="width: 80%">
        <el-table-column prop="regionId" label="发送源id" label-width="150"></el-table-column>
        <el-table-column prop="accessKeyId" label="密钥id" label-width="120"></el-table-column>
        <el-table-column prop="secret" label="密钥" label-width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="120"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" label-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="editAccessKey(scope.row)">编辑</el-button>
            <el-button type="text" size="medium" @click="handleDeleteAccessKey(scope.row)">删除</el-button>
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
    <!-- 密钥信息弹出框 -->
    <div class="access-key-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="dialog.title"
        :visible.sync="dialog.showDialog"
        width="30%">
        <el-form :model="accessKey" :rules="accessKeyRules" ref="accessKey">
          <el-form-item label="发送源id：" prop="regionId" :label-width="dialog.formLabelWidth">
            <el-input v-model="accessKey.regionId" style="width: 300px;" placeholder="请输入发送源id"></el-input>
          </el-form-item>
          <el-form-item label="密钥id：" prop="accessKeyId" :label-width="dialog.formLabelWidth">
            <el-input v-model="accessKey.accessKeyId" style="width: 300px;" placeholder="请输入密钥id"></el-input>
          </el-form-item>
          <el-form-item label="密钥：" prop="secret" :label-width="dialog.formLabelWidth">
            <el-input v-model="accessKey.secret" style="width: 300px;" placeholder="请输入密钥"></el-input>
          </el-form-item>
          <el-form-item label="登录密码：" prop="password" :label-width="dialog.formLabelWidth">
            <el-input v-model="accessKey.password" style="width: 300px;" placeholder="请输入登录密码"></el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="resetAccessKey">取 消</el-button>
            <el-button v-if="isUpdate" type="primary" @click="confirmAddAccessKey">确定修改</el-button>
            <el-button v-else type="primary" @click="confirmAddAccessKey">确定新增</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import accessKeyService from '../services/accessKeyService'
export default {
  name: 'AccessKey',
  data () {
    return {
      accessKeyData: [],
      accessKey: {
        regionId: '',
        accessKeyId: '',
        secret: '',
        password: '' // 为了能够进行属性校验
      },
      accessKeyRules: {
        regionId: [{ required: true, message: '发送源 id 不能为空', trigger: 'blur' }],
        accessKeyId: [{ required: true, message: '密钥 id 不能为空', trigger: 'blur' }],
        secret: [{ required: true, message: '密钥不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '仓库管理员密码不能为空', trigger: 'blur' }]
      },
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0
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
    this.findAccessKeyPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findAccessKeyPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findAccessKeyPage()
    },
    showAddAccessKeyDialog () {
      this.dialog.title = '新增短信服务密钥'
      this.isUpdate = false
      this.dialog.showDialog = true
    },
    editAccessKey (accessKey) {
      this.dialog.title = '修改短信服务密钥信息'
      this.accessKey = accessKey
      this.isUpdate = true
      this.dialog.showDialog = true
    },
    findAccessKeyPage () {
      accessKeyService.findAccessKeyPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.getAccessKeyPageInfo
          this.queryCondition.total = pageInfo.total
          this.accessKeyData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    addAccessKey () {
      accessKeyService.addAccessKey(this.accessKey, this.accessKey.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('新增成功')
        } else {
          this.$message.error(responseData.failMessage.message)
        }
        this.resetAccessKey()
      })
    },
    handleDeleteAccessKey (accessKey) {
      this.$prompt('请输入仓库管理员密码:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.accessKey = accessKey
        this.accessKey.password = value
        this.deleteAccessKey()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    deleteAccessKey () {
      accessKeyService.deleteAccessKey(this.accessKey, this.accessKey.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    updateAccessKey () {
      accessKeyService.updateAccessKey(this.accessKey, this.accessKey.password).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(responseData.failMessage.message)
        }
        this.resetAccessKey()
      })
    },
    confirmAddAccessKey () {
      this.$refs['accessKey'].validate((valid) => {
        if (valid) {
          if (this.isUpdate) this.updateAccessKey()
          else this.addAccessKey()
        }
      })
    },
    // 重置密钥信息
    resetAccessKey () {
      this.dialog.showDialog = false
      this.$refs['accessKey'].resetFields()
      this.accessKey = {
        regionId: '',
        accessKeyId: '',
        secret: '',
        password: ''
      }
    }
  },
  computed: {}
}
</script>

<style scoped>
@import '../assets/style/accessKey.css';
@import '../assets/style/reset.css';
</style>
