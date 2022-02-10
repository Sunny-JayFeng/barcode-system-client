import { request } from '@/request/request'

export default {
  /**
   * 打印客户定制标签
   * @param customerLabelBo 标签信息
   * @returns {*}
   */
  async printCustomerLabel (customerLabelBo) {
    return request({
      method: 'POST',
      url: '/customerLabel/printCustomerLabel',
      data: customerLabelBo
    })
  }
}
