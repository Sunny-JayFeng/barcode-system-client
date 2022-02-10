import { request } from '@/request/request'

export default {
  /**
   * 分页查询盘点日志
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findInventoryLogPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/inventoryLog/findInventoryLogPage',
      data: queryCondition
    })
  }
}
