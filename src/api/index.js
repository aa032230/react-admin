import ajax from './ajax'

// 登录
export const reqLogin = params => ajax('/login', params, 'post')
