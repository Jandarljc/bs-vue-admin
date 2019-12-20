import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

export function add(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data,
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

export function fetchUserList() {
  return request({
    url: '/user/sendUserList.json',
    method: 'get',
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    baseURL: process.env.VUE_APP_LOGIN_API,
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    baseURL: process.env.VUE_APP_LOGIN_API,
    params: { token }
  })
}

/**
 * 名人名言 接口
 * @param {查询参数} query
 */
export function fetchRandomMottoData() {
  return request({
    url: '/motto/sendRandomMottoData.json',
    method: 'get',
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}

/**
 * 头像上传 接口
 * @param {查询参数} data
 */
export function uploadAvatar(file, token) {
  return request({
    url: 'user/sendUploadAvatarData.json',
    method: 'post',
    params: { file, token },
    baseURL: process.env.VUE_APP_LOGIN_API
  })
}
