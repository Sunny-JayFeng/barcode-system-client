<!-- 导航栏 -->
<template>
  <div class="container">
    <div class="logo-img" :style="{backgroundImage: `url(${logo})`}"></div>
    <el-menu
      router
      class="el-menu-vertical-demo"
      background-color="#6169E1"
      text-color="#fff"
      unique-opened
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>基础数据管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/barcode/accessKey">短信服务密钥管理</el-menu-item>
          <el-menu-item index="/barcode/customer">客户信息管理</el-menu-item>
          <el-menu-item index="/barcode/user">用户信息管理</el-menu-item>
          <el-menu-item index="/barcode/product">产品信息管理</el-menu-item>
          <el-menu-item index="/barcode/customerLabel">客户定制标签</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-shop"></i>
          <span>仓库管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/barcode/shelf">货架信息管理</el-menu-item>
          <el-menu-item index="/barcode/warehouse">仓库信息管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>库存管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/barcode/goodsOrder">出货单管理</el-menu-item>
          <el-menu-item index="/barcode/inventoryLog">盘点信息管理</el-menu-item>
          <el-menu-item index="/barcode/packBoxStockLog">拼盒信息管理</el-menu-item>
          <el-menu-item index="/barcode/packCaseStockLog">拼箱信息管理</el-menu-item>
          <el-menu-item index="/barcode/stock">产品库存信息管理</el-menu-item>
          <el-menu-item index="/barcode/stockLog">产品库存操作日志管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/barcode/roleAccess">访问控制</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  data () {
    return {
      logo: require('../assets/img/dolphin.png'),
      defaultActive: '/barcode/accessKey'
    }
  },
  methods: {}
}
</script>

<style scoped>
@import '../assets/style/nav.css';
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
</style>
