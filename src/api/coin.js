import request from '@/utils/request'

/**
 * 游戏币交易数据 接口
 * @param {查询参数} query
 */
export function fetchAllCoinList() {
  return request({
    url: '/coin/sendGetCoinData.json',
    method: 'get',
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

/**
 * 游戏币交易数据 分页接口
 * @param {查询参数} query
 */
export function fetchPageCoinList(query) {
  return request({
    url: '/coin/sendGetCoinPageData.json',
    method: 'post',
    params: query,
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

/**
 * 游戏币交易数据 删除接口
 * @param {查询参数} data
 */
export function fetchDeleteData(id) {
  return request({
    url: '/coin/sendDeleteData.json/' + id,
    method: 'get',
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

/**
 * 游戏币交易数据 批量删除接口
 * @param {查询参数} query
 */
export function fetchBatchDeleteData(data) {
  return request({
    url: '/coin/sendBatchDeleteData.json',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}
