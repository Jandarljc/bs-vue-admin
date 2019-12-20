import request from '@/utils/request'

/**
 * 游戏币种类数据 接口
 * @param {查询参数} query
 */
export function fetchAllTypeList() {
  return request({
    url: '/type/sendGetTypeData.json',
    method: 'get',
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}
