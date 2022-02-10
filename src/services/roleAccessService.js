import { request } from '@/request/request'

export default {
  /**
   * 分页查询角色访问控制模块信息
   * @param queryCondition 查询条件
   * @returns {*}
   */
  async findRoleAccessControlPage (queryCondition) {
    return request({
      method: 'GET',
      url: '/roleAccessControl/findRoleAccessControlPage',
      data: queryCondition
    })
  },

  /**
   * 添加角色访问模块信息
   * @param roleAccessControl 访问控制信息
   * @param password 操作人密码
   * @returns {*}
   */
  async addRoleAccessControl (roleAccessControl, password) {
    return request({
      method: 'POST',
      url: '/roleAccessControl/addRoleAccessControl/' + password,
      data: roleAccessControl
    })
  },

  /**
   * 更新访问控制模块信息
   * @param roleAccessControl 访问控制信息
   * @param password 操作人密码
   * @returns {*}
   */
  async updateRoleAccessControl (roleAccessControl, password) {
    return request({
      method: 'PUT',
      url: '/roleAccessControl/updateRoleAccessControl/' + password,
      data: roleAccessControl
    })
  },

  /**
   * 删除角色访问控制模块信息
   * @param roleAccessControl 访问控制信息
   * @param password 操作人密码
   * @returns {*}
   */
  async deleteRoleAccessControl (roleAccessControl, password) {
    return request({
      method: 'DELETE',
      url: '/roleAccessControl/deleteRoleAccessControl/' + password,
      data: roleAccessControl
    })
  }
}
