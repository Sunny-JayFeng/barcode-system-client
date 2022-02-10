import { request } from '@/request/request'

export default {
  /**
   * 分页查询拼箱日志数据
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findPackCaseStockLogPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/packCaseStockLog/findPackCaseStockLogPage',
      data: queryCondition
    })
  },

  /**
   * 根据拼箱编号查询数据
   * @param packCaseNumber 拼箱编号
   * @returns {*}
   */
  async findByPackCaseNumber (packCaseNumber) {
    return request({
      method: 'GET',
      url: '/packCaseStockLog/findByPackCaseNumber/' + packCaseNumber,
      data: null
    })
  }
}
