<!-- 访问权限管理页面 -->
<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-condition">
      <el-form :inline="true" :model="queryCondition">
        <el-row>
          <el-col :span="4">
            <el-form-item label="角色名称：">
              <el-input v-model="queryCondition.roleName" placeholder="根据角色名称查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="访问模块路径：">
              <el-input style="width: 260px" v-model="queryCondition.accessModelBasePath" placeholder="根据访问模块路径查询"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="findRoleAccessControlPage">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="add-role-access-btn">
      <el-button type="primary" size="medium" @click="showAddRoleAccessDialog">添加访问模块</el-button>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="roleAccessData" border style="width: 80%">
        <el-table-column prop="role" label="角色" label-width="150">
          <template slot-scope="scope">
            <span v-if="role === 0">系统管理员(开发人员)</span>
            <span v-else-if="role === 1">仓库管理员</span>
            <span v-else-if="role === 2">仓库工作人员</span>
            <span v-else-if="role === 3">公司管理层</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名" label-width="120"></el-table-column>
        <el-table-column prop="accessModelBasePath" label="允许访问的模块基础路径" label-width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" label-width="120"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" label-width="300"></el-table-column>
        <el-table-column fixed="right" label="操作" label-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="handleDeleteRoleAccess(scope.row)">删除模块访问权限</el-button>
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
    <div class="role-access-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="dialog.title"
        :visible.sync="dialog.showDialog"
        width="30%">
        <el-form :model="roleAccess" :rules="roleAccessRules" ref="roleAccess">
          <el-form-item label="模块路径" prop="accessModelBasePath" :label-width="dialog.formLabelWidth">
            <el-input v-model="roleAccess.accessModelBasePath" style="width: 300px" placeholder="情输入模块路径"></el-input>
          </el-form-item>
          <el-form-item label="模块图标" prop="modelImage" :label-width="dialog.formLabelWidth">
            <el-input v-model="roleAccess.modelImage" style="width: 300px" placeholder="请输入模块图标"></el-input>
          </el-form-item>
          <el-form-item label="分配给角色" prop="role" :label-width="dialog.formLabelWidth">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckedAllRoleChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
              <el-checkbox v-for="item in roleOptions" :label="item" :key="item.role">{{item.roleName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="当前账号的密码：" prop="password" :label-width="dialog.formLabelWidth">
            <el-input v-model="roleAccess.password" style="width: 300px;" placeholder="请输入当前账号的密码"></el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button @click="resetRoleAccess">取 消</el-button>
            <el-button v-if="isUpdate" type="primary" @click="confirmUpdateOrAddRoleAccess">确定修改</el-button>
            <el-button v-else type="primary" @click="confirmUpdateOrAddRoleAccess">确定新增</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import roleAccessService from '../services/roleAccessService'
export default {
  name: 'RoleAccess',
  data () {
    return {
      roleAccessData: [],
      roleAccess: {
        id: undefined,
        role: undefined,
        accessModelBasePath: '',
        modelImage: '',
        password: ''
      },
      checkAll: false,
      roleOptions: [
        {role: 1, roleName: '仓库管理员'},
        {role: 2, roleName: '仓库工作人员'},
        {role: 3, roleName: '公司管理层'}
      ],
      checkedRoles: [],
      isIndeterminate: null,
      isUpdate: false,
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        roleName: '',
        accessModelBasePath: ''
      },
      roleAccessRules: {
        role: [{ required: true, message: '分配角色不能为空', trigger: 'blur' }],
        accessModelBasePath: [{ required: true, message: '访问路径不能为空', trigger: 'blur' }],
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
    this.findRoleAccessControlPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findRoleAccessControlPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findRoleAccessControlPage()
    },
    handleCheckedAllRoleChange (val) {
      this.checkedRoles = val ? this.roleOptions : []
      this.isIndeterminate = false
    },
    handleCheckedRolesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.roleOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleOptions.length
    },
    handleDeleteRoleAccess (roleAccess) {
      this.$prompt('请输入登录密码:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.roleAccess = roleAccess
        this.roleAccess['password'] = value
        this.deleteRoleAccessControl()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    findRoleAccessControlPage () {
      roleAccessService.findRoleAccessControlPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findRoleAccessControlPageInfo
          this.queryCondition.total = pageInfo.total
          this.roleAccessData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    showAddRoleAccessDialog () {
      this.dialog.showDialog = true
      if (this.isUpdate) this.dialog.title = '修改访问模块'
      else this.dialog.title = '新增访问模块'
    },
    handleCheckedRoles () {
      this.roleAccess.role = this.checkedRoles[0].role
      this.roleAccess.id = this.checkedRoles[0].role // 用 id 去存，因为 role 是 byte 类型。可能会超出
      for (let i = 1; i < this.checkedRoles.length; i++) {
        this.roleAccess.id = this.roleAccess.id * 10 + this.checkedRoles[i].role
      }
      console.log(this.roleAccess)
    },
    confirmUpdateOrAddRoleAccess () {
      this.handleCheckedRoles()
      this.$refs['roleAccess'].validate((valid) => {
        if (valid) {
          if (this.isUpdate) this.updateRoleAccessControl()
          else this.addRoleAccessControl()
        }
      })
    },
    addRoleAccessControl () {
      roleAccessService.addRoleAccessControl(this.roleAccess, this.managerPassword).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('添加成功')
          this.findRoleAccessControlPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    updateRoleAccessControl () {
      roleAccessService.updateRoleAccessControl(this.roleAccess, this.managerPassword).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('修改成功')
          this.findRoleAccessControlPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    deleteRoleAccessControl () {
      roleAccessService.deleteRoleAccessControl(this.roleAccess, this.managerPassword).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('删除成功')
          this.findRoleAccessControlPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    resetRoleAccess () {
      this.dialog.showDialog = false
      this.$refs['roleAccess'].resetFields()
      this.roleAccess = {
        id: undefined,
        role: undefined,
        accessModelBasePath: '',
        modelImage: '',
        password: ''
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/style/roleAccess.css';
@import '../assets/style/reset.css';
</style>
