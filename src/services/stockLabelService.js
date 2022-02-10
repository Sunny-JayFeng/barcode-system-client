import { request } from '@/request/request'

export default {
  /**
   * 打印库存标签
   * @param stockLabelBo 标签信息
   * @returns {*}
   */
  async printStockLabel (stockLabelBo) {
    return request({
      method: 'POST',
      url: '/stockLabel',
      data: stockLabelBo
    })
  }
}
