import { request } from '@/request/request'

export default {
  /**
   * 分页查询拼盒日志
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findPackBoxStockLogPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/packBoxStockLog/findPackBoxStockLogPage',
      data: queryCondition
    })
  },

  /**
   * 根据拼盒编号查询数据明细
   * @param packBoxNumber 拼盒编号
   * @returns {*}
   */
  async findByPackBoxNumber (packBoxNumber) {
    return request({
      method: 'GET',
      url: '/packBoxStockLog/findByPackBoxNumber/' + packBoxNumber,
      data: null
    })
  }
}
