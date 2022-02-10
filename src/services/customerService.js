import { request } from '@/request/request'

export default {
  /**
   * 分页查询客户信息
   * @param queryCondition 查询参数
   * @returns {*}
   */
  async findCustomerPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/customer/findCustomerPage',
      data: queryCondition
    })
  },

  /**
   * 新增客户信息
   * @param customer 客户信息
   * @returns {*}
   */
  async addCustomer (customer) {
    return request({
      method: 'POST',
      url: '/customer/addCustomer',
      data: customer
    })
  },

  /**
   * 更新客户信息
   * @param customer 客户信息
   * @param password 操作人的密码
   * @returns {*}
   */
  async updateCustomer (customer, password) {
    return request({
      method: 'PUT',
      url: '/customer/updateCustomer/' + password,
      data: customer
    })
  },

  /**
   * 删除客户信息
   * @param customer 客户信息
   * @param password 操作人的密码
   * @returns {*}
   */
  async deleteCustomer (customer, password) {
    return request({
      method: 'DELETE',
      url: '/customer/deleteCustomer/' + password,
      data: customer
    })
  }
}
