import { request } from '@/request/request'

export default {
  /**
   * 分页查询库存信息
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findStockPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/stock/findStockPage',
      data: queryCondition
    })
  },

  /**
   * 根据出货单号查询出货数据
   * @param goodsOrderNumber 出货单号
   * @returns {*}
   */
  async findByGoodsOrderNumber (goodsOrderNumber) {
    return request({
      method: 'GET',
      url: '/stock/findByGoodsOrderNumber',
      data: goodsOrderNumber
    })
  }
}
