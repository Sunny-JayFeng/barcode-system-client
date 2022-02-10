import { request } from '@/request/request'

export default{

  /**
   * 查询用户信息
   * @param queryCondition 查询条件
   * @returns {Promise<*>}
   */
  async findUserPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/user/findUserPage',
      data: queryCondition
    })
  },

  /**
   * 根据角色查找用户信息
   * @param role 角色
   * @returns {Promise<*>}
   */
  async findUserByRole (role) {
    return request({
      method: 'GET',
      url: '/user/findUserByRole/' + role,
      data: null
    })
  },

  /**
   * 用户登录
   * @param user 用户信息
   * @returns {*}
   */
  async login (user) {
    return request({
      method: 'POST',
      url: '/user/login',
      data: user
    })
  },

  /**
   * 用户注册
   * @param user 用户信息
   * @param password 操作人密码
   * @returns {*}
   */
  async registry (user, password) {
    return request({
      method: 'POST',
      url: '/user/registry/' + password,
      data: user
    })
  },

  /**
   * 新增系统用户
   * @param user 用户信息
   * @param password 当前登录的密码
   * @returns {Promise<*>}
   */
  async addUser (user, password) {
    return request({
      method: 'POST',
      url: '/user/addUser/' + password,
      data: user
    })
  },
  /**
   * 更新用户角色信息
   * @param user 用户
   * @param password 操作人密码
   * @returns {*}
   */
  async updateUserRole (user, password) {
    return request({
      method: 'PUT',
      url: '/user/updateUserRole/' + password,
      data: user
    })
  },

  /**
   * 删除用户信息
   * @param user 用户信息
   * @param password 操作人密码
   * @returns {*}
   */
  async deleteUser (user, password) {
    return request({
      method: '/DELETE',
      url: '/user/deleteUser/' + password,
      data: user
    })
  }
}
