import { request } from '@/request/request'

export default {
  /**
   * 分页查询库存操作日志信息
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findStockLogPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/stockLog/findStockLogPage',
      data: queryCondition
    })
  }
}
