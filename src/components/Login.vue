<!-- 系统登录页面 -->
<template>
  <div class="container" :style="{backgroundImage: `url(${backgroundImage})`}">
    <!-- 系统名称 -->
    <span class="title">小海豚仓库管理系统</span>
    <!-- 登录框 -->
    <div class="login-wrapper">
      <span class="tip">系统登录</span>
      <el-form :model="user" :rules="userRules" ref="userForm" label-width="100px">
        <!-- 用户名输入框 -->
        <el-form-item label="用户名" prop="userName">
          <el-input style="font-size: 1.5em" type="text" v-model="user.userName"></el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item label="密码" prop="password">
          <el-input style="font-size: 1.5em" type="password" v-model="user.password"></el-input>
        </el-form-item>
        <!-- 登录注册按钮 -->
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import userService from '../services/userService'
import { Message } from 'element-ui'
export default {
  name: 'Login',
  data () {
    // 登录是否成功
    var checkUserNameExist = (rule, userName, callback) => {
      if (this.loginFail) callback(new Error('用户名或密码错误'))
      else callback()
    }
    // 密码长度校验
    var checkPasswordLength = (rule, password, callback) => {
      if (password.length < 8) {
        callback(new Error('密码长度有误'))
      } else {
        callback()
      }
    }
    // 登录是否成功
    var checkPasswordCorrect = (rule, password, callback) => {
      if (this.loginFail) callback(new Error('用户名或密码错误'))
      else callback()
    }
    return {
      backgroundImage: require('../assets/img/background.jpg'),
      user: {
        userName: '',
        password: ''
      },
      loginFail: false,
      userRules: {
        userName: [{required: true, message: '请输入用户名', trigger: 'blur'}, {validator: checkUserNameExist, trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}, {validator: checkPasswordLength, trigger: 'blur'}, {validator: checkPasswordCorrect, trigger: 'blur'}]
      }
    }
  },
  methods: {
    login () {
      console.log('登录 user: ' + this.user)
      userService.login(this.user).then(response => {
        console.log(response)
        let data = response.responseData
        if (data.success) {
          Message.success('登录成功')
        } else {
          Message.error(data.failMessage.message)
          this.loginFail = true
          this.$refs['userForm'].validateField('userName')
          this.$refs['userForm'].validateField('password')
          this.loginFail = false
        }
      })
    }
  }
}
</script>

<style scoped>
@import '../assets/style/login.css';
</style>
