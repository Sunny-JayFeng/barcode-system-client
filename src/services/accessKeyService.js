import { request } from '@/request/request'

export default {

  /**
   * 分页查询短信服务密钥信息
   * @param queryConditions 查询条件
   * @returns {*}
   */
  async findAccessKeyPage (queryConditions) {
    return request({
      method: 'GET',
      url: '/accessKey/getAccessKeyPage',
      data: queryConditions
    })
  },

  /**
   * 添加一个短信服务密钥
   * @param accessKey 密钥
   * @param password 操作人的密码
   * @returns {*}
   */
  async addAccessKey (accessKey, password) {
    return request({
      method: 'POST',
      url: '/accessKey/addAccessKey/' + password,
      data: accessKey
    })
  },

  /**
   * 删除短信服务密钥
   * @param accessKey 密钥
   * @param password 操作人的密码
   * @returns {*}
   */
  async deleteAccessKey (accessKey, password) {
    return request({
      method: 'DELETE',
      url: '/accessKey/deleteAccessKey/' + password,
      data: accessKey
    })
  },

  /**
   * 更新短信服务密钥信息
   * @param accessKey 密钥
   * @param password 操作人的密码
   * @returns {*}
   */
  async updateAccessKey (accessKey, password) {
    return request({
      method: 'PUT',
      url: '/accessKey/updateAccessKey/' + password,
      data: accessKey
    })
  }
}
