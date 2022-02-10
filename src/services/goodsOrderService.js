import { request } from '@/request/request'

export default {

  /**
   * 分页查询出货单信息
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findGoodsOrderPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/goodsOrder/findGoodsOrderPage',
      data: queryCondition
    })
  },

  /**
   * 获取库存用于创建出货单
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findStockToCreateOrder (queryCondition) {
    return request({
      method: 'GET',
      url: '/goodsOrder/findStockToCreateOrder',
      data: queryCondition
    })
  },

  /**
   * 勾选某个库存，库存加锁，用于创建出货单
   * @param stockId 库存 id
   * @returns {*}
   */
  async lockStockToCreateOrder (stockId) {
    return request({
      method: 'POST',
      url: '/goodsOrder/lockStockToCreateOrder/' + stockId,
      data: null
    })
  },

  /**
   * 取消勾选，库存释放锁
   * @param stockId 库存 id
   * @returns {*}
   */
  async unLockStockOfCreateOrder (stockId) {
    return request({
      method: 'POST',
      url: '/goodsOrder/unLockStockOfCreateOrder/' + stockId,
      data: null
    })
  },

  /**
   * 没有点击确认生成出货单就退出页面 -- 释放所有锁
   * @param stockIds 库存 id 列表
   * @returns {*}
   */
  async unLockGoodsOrderStock (stockIds) {
    return request({
      method: 'POST',
      url: '/goodsOrder/unLockGoodsOrderStock',
      data: stockIds
    })
  },

  /**
   * 生成出货单
   * @param requestParams 请求参数
   * String customerName 客户名称
   * String proMaterialNumber 料号
   * String proModel 型号
   * Integer amount 出货数量
   * @returns {*}
   */
  async createGoodsOrder (requestParams) {
    return request({
      method: 'POST',
      url: '/goodsOrder/createGoodsOrder',
      data: requestParams
    })
  },

  /**
   * 确认出货
   * @param stockIds 库存 id 列表
   * @param goodsOrderId 出货单 id
   * @returns {*}
   */
  async confirmOutStock (stockIds, goodsOrderId) {
    return request({
      method: 'PUT',
      url: '/goodsOrder/confirmOutStock/' + goodsOrderId,
      data: stockIds
    })
  }
}
