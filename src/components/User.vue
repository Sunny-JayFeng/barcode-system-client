<!-- 用户管理页面 -->
<template>
  <div class="container">
    <!-- 查询条件 -->
    <div class="query-condition">
      <el-form :inline="true" :model="queryCondition">
        <el-form-item label="用户名：">
          <el-input v-model="queryCondition.userName" placeholder="根据用户名查询"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="queryCondition.phone" placeholder="根据手机号查询"></el-input>
        </el-form-item>
        <el-form-item label="角色：">
          <el-select v-model="queryCondition.role" placeholder="根据角色查询">
            <el-option label="全部" :value="undefined"></el-option>
            <el-option label="系统管理员" :value="0"></el-option>
            <el-option label="仓库管理员" :value="1"></el-option>
            <el-option label="仓库工作人员" :value="2"></el-option>
            <el-option label="公司管理层" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findUserPage">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 按钮 -->
    <div class="add-user-btn">
      <el-button type="primary" size="medium" @click="dialog.showDialog = true">添加系统用户</el-button>
    </div>
    <!-- 表格数据 -->
    <div class="table-data">
      <el-table :data="userData" border style="width: 80%">
        <el-table-column prop="userName" label="用户名" label-width="150"></el-table-column>
        <el-table-column prop="phone" label="手机号" label-width="150"></el-table-column>
        <el-table-column prop="role" label="角色" label-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.role === 0">系统管理员</span>
            <span v-else-if="scope.row.role === 1">仓库管理员</span>
            <span v-else-if="scope.row.role === 2">仓库工作人员</span>
            <span v-else-if="scope.row.role === 3">公司管理层</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色名" label-width="120"></el-table-column>
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
    <!-- 添加用户弹出框 -->
    <div class="add-user-dialog">
      <el-dialog
        :close-on-click-modal=false
        :close-on-press-escape=false
        :title="dialog.title"
        :visible.sync="dialog.showDialog"
        width="30%">
        <el-form :model="user" :rules="userRules" ref="user">
          <el-form-item label="用户名：" prop="userName" :label-width="dialog.formLabelWidth">
            <el-input v-model="user.userName" style="width: 300px;" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password" :label-width="dialog.formLabelWidth">
            <el-input v-model="user.password" style="width: 300px;" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword" :label-width="dialog.formLabelWidth">
            <el-input v-model="user.confirmPassword" style="width: 300px" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone" :label-width="dialog.formLabelWidth">
            <el-input v-model="user.phone" style="width: 300px" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="角色：" prop="phone" :label-width="dialog.formLabelWidth">
            <el-select @change="handleUserRoleChange" style="width: 190px" v-model="user.role" placeholder="请选择角色">
              <el-option label="仓库管理员" :value="1"></el-option>
              <el-option label="仓库工作人员" :value="2"></el-option>
              <el-option label="公司管理层" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="当前登录的密码：" prop="nowLoginPassword" :label-width="dialog.formLabelWidth">
            <el-input v-model="user.nowLoginPassword" style="width: 300px" placeholder="请输入当前登录的密码"></el-input>
          </el-form-item>
          <div class="dialog-footer">
            <el-button type="primary" @click="resetUser">取 消</el-button>
            <el-button type="primary" @click="confirmAddUser">确定新增</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import userService from '../services/userService'
export default {
  name: 'User',
  data () {
    // 两次输入密码必须一致
    const passwordConsistent = (rule, value, callback) => {
      if (value !== this.user.password) {
        return callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      userData: [],
      user: {
        userName: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: undefined,
        roleName: '',
        nowLoginPassword: '' // 为了属性校验
      },
      userRules: {
        userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        confirmPassword: [{ validator: passwordConsistent, required: true, message: '两次输入密码不一致', trigger: 'blur' }, { required: true, message: '密码不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        role: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        nowLoginPassword: [{ required: true, message: '仓库管理员密码不能为空', trigger: 'blur' }]
      },
      queryCondition: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        userName: '',
        phone: '',
        role: undefined
      },
      dialog: {
        title: '新增系统用户',
        showDialog: false,
        formLabelWidth: '155px'
      }
    }
  },
  created () {
    this.findUserPage()
  },
  methods: {
    handleSizeChange (val) {
      this.queryCondition.pageSize = val
      this.queryCondition.currentPage = 1
      this.findUserPage()
    },
    handleCurrentChange (val) {
      this.queryCondition.currentPage = val
      this.findUserPage()
    },
    handleUserRoleChange () {
      console.log(this.user)
      if (this.user.role === 1) this.user.roleName = '仓库管理员'
      else if (this.user.role === 2) this.user.roleName = '仓库工作人员'
      else if (this.user.role === 3) this.user.roleName = '公司管理层'
    },
    findUserPage () {
      userService.findUserPage(this.queryCondition).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          let pageInfo = responseData.findUserPageInfo
          this.queryCondition.total = pageInfo.total
          this.userData = pageInfo.records
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    confirmAddUser () {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.addUser()
        }
      })
    },
    addUser () {
      userService.addUser(this.user, this.user.nowLoginPassword).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('添加成功')
          this.findUserPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    updateUserRole () {
      userService.updateUserRole(this.user, this.user.nowLoginPassword).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('修改成功')
          this.findUserPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    deleteUser () {
      userService.deleteUser(this.user, this.user.nowLoginPassword).then(response => {
        console.log(response)
        let responseData = response.responseData
        if (responseData.success) {
          this.$message.success('删除成功')
          this.findUserPage()
        } else {
          this.$message.error(responseData.failMessage.message)
        }
      })
    },
    resetUser () {
      this.dialog.showDialog = false
      this.$refs['user'].resetFields()
      this.user = {
        userName: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: undefined,
        roleName: '',
        nowLoginPassword: '' // 为了属性校验
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/style/user.css';
@import '../assets/style/reset.css';
</style>
