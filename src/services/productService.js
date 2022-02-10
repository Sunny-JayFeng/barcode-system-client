import { request } from '@/request/request'

export default {
  /**
   * 分页查询产品信息
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findProductsPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/product/findProductsPage',
      data: queryCondition
    })
  },

  /**
   * 更新产品信息
   * @param requestParams 请求参数
   * @returns {*}
   */
  async updateProduct (requestParams) {
    return request({
      method: 'PUT',
      url: '/product/updateProduct',
      data: requestParams
    })
  },

  /**
   * 添加产品信息
   * @param product 产品信息
   * @returns {*}
   */
  async addProduct (product) {
    return request({
      method: 'POST',
      url: '/product/addProduct',
      data: product
    })
  },

  /**
   * 删除产品信息
   * @param product 产品信息
   * @param password 操作人密码
   * @returns {*}
   */
  async deleteProduct (product, password) {
    return request({
      method: 'DELETE',
      url: '/product/deleteProduct/' + password,
      data: product
    })
  }
}
