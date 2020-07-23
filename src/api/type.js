import request from '@/utils/request'

/**
 * 游戏种类数据 接口
 * @param {查询参数} query
 */
export function fetchAllTypeList() {
  return request({
    url: '/type/sendGetTypeData.json',
    method: 'get',
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

/**
 * 游戏种类数据列表 接口
 * @param {查询参数} query
 */
export function fetchTypeList() {
  return request({
    url: '/type/sendGetTypeJson.json',
    method: 'get',
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}
