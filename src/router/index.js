import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Router)
Vue.use(VueAxios, axios)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/barcode/accessKey',
      name: 'AccessKey',
      component: () => import('@/components/AccessKey')
    },
    {
      path: '/barcode/customer',
      name: 'Customer',
      component: () => import('@/components/Customer')
    },
    {
      path: '/barcode/customerLabel',
      name: 'CustomerLabel',
      component: () => import('@/components/CustomerLabel')
    },
    {
      path: '/barcode/goodsOrder',
      name: 'GoodsOrder',
      component: () => import('@/components/GoodsOrder')
    },
    {
      path: '/barcode/inventoryLog',
      name: 'InventoryLog',
      component: () => import('@/components/InventoryLog')
    },
    {
      path: '/barcode/login',
      name: 'Login',
      component: () => import('@/components/Login')
    },
    {
      path: '/barcode/nav',
      name: 'Nav',
      component: () => import('@/components/Nav')
    },
    {
      path: '/barcode/packBoxStockLog',
      name: 'PackBoxStockLog',
      component: () => import('@/components/PackBoxStockLog')
    },
    {
      path: '/barcode/packCaseStockLog',
      name: 'PackCaseStockLog',
      component: () => import('@/components/PackCaseStockLog')
    },
    {
      path: '/barcode/product',
      name: 'Product',
      component: () => import('@/components/Product')
    },
    {
      path: '/barcode/roleAccess',
      name: 'RoleAccess',
      component: () => import('@/components/RoleAccess')
    },
    {
      path: '/barcode/shelf',
      name: 'Shelf',
      component: () => import('@/components/Shelf')
    },
    {
      path: '/barcode/stock',
      name: 'Stock',
      component: () => import('@/components/Stock')
    },
    {
      path: '/barcode/stockLabel',
      name: 'StockLabel',
      component: () => import('@/components/StockLabel')
    },
    {
      path: '/barcode/stockLog',
      name: 'StockLog',
      component: () => import('@/components/StockLog')
    },
    {
      path: '/barcode/user',
      name: 'User',
      component: () => import('@/components/User')
    },
    {
      path: '/barcode/warehouse',
      name: 'Warehouse',
      component: () => import('@/components/Warehouse')
    }
  ]
})
