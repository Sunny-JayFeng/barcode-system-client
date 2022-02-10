import { request } from '@/request/request'

export default {
  /**
   * 分页查询仓库信息
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findWarehousePage (queryCondition) {
    return request({
      method: 'GET',
      url: '/warehouse/findWarehousePage',
      data: queryCondition
    })
  },

  /**
   * 查询所有仓库信息
   * @returns {Promise<*>}
   */
  async findWarehouse () {
    return request({
      method: 'GET',
      url: '/warehouse/findWarehouse',
      data: null
    })
  },

  /**
   * 添加仓库信息
   * @param warehouse 仓库信息
   * @param password 操作人密码
   * @returns {*}
   */
  async addWarehouse (warehouse, password) {
    return request({
      method: 'POST',
      url: '/warehouse/addWarehouse/' + password,
      data: warehouse
    })
  },

  /**
   * 更新仓库信息
   * @param warehouse 仓库信息
   * @param password 操作人密码
   * @returns {*}
   */
  async updateWarehouse (warehouse, password) {
    return request({
      method: 'PUT',
      url: '/warehouse/updateWarehouse/' + password,
      data: warehouse
    })
  },

  /**
   * 删除仓库信息
   * @param warehouse 仓库信息
   * @param password 操作人密码
   * @returns {*}
   */
  async deleteWarehouse (warehouse, password) {
    return request({
      method: '/DELETE',
      url: '/warehouse/deleteWarehouse/' + password,
      data: warehouse
    })
  },

  /**
   * 打印仓库标签
   * @param warehouse 标签信息
   * @returns {*}
   */
  async printWarehouseLabel (warehouse) {
    return request({
      method: 'POST',
      url: '/warehouse/printWarehouseLabel',
      data: warehouse
    })
  }
}
