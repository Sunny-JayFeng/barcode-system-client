import { request } from '@/request/request'

export default {
  /**
   * 分页查询货架信息
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findShelfPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/shelf/findShelfPage',
      data: queryCondition
    })
  },

  async findShelfNumberByWareCode (wareCode) {
    return request({
      method: 'GET',
      url: '/shelf/findShelfNumberByWareCode/' + wareCode,
      data: null
    })
  },

  /**
   * 添加货架信息
   * @param shelf 货架信息
   * @param password 操作人密码
   * @returns {*}
   */
  async addShelf (shelf, password) {
    return request({
      method: 'POST',
      url: '/shelf/addShelf/' + password,
      data: shelf
    })
  },

  /**
   * 更新货架信息
   * @param shelf 货架信息
   * @param password 操作人密码
   * @returns {*}
   */
  async updateShelf (shelf, password) {
    return request({
      method: 'PUT',
      url: '/shelf/updateShelf/' + password,
      data: shelf
    })
  },

  /**
   * 删除货架信息
   * @param shelf 货架信息
   * @param password 操作人密码
   * @returns {*}
   */
  async deleteShelf (shelf, password) {
    return request({
      method: 'DELETE',
      url: '/shelf/deleteShelf/' + password,
      data: shelf
    })
  },

  /**
   * 打印货架标签
   * @param shelf 标签信息
   * @returns {*}
   */
  async printShelfLabel (shelf) {
    return request({
      method: 'POST',
      url: '/shelf/printShelfLabel',
      data: shelf
    })
  }
}
