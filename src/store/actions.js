import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './actionType'
import storageUtils from '../utils/storageUtils'
import { reqLogin } from '../api'
// 设置头部标题
export const setHeadTitle = title => ({ type: SET_HEAD_TITLE, title })

// 接收用户信息
export const receiveUser = user => ({ type: RECEIVE_USER, user })

// 接收错误信息
export const show_error_msg = user => ({ type: RECEIVE_USER, user })

// 退出登录
export const logout = () => {
    storageUtils.removeStore('userData')
    return { type: RESET_USER }
}

//登录
export const login = userData => {
    return async dispatch => {
        const res = await reqLogin(userData)
        if (res.status === 0) {
            storageUtils.setStore('userData', res.data)
            const user = res.data
            dispatch({ type: RECEIVE_USER, user })
        } else {
            dispatch({ type: SHOW_ERROR_MSG, data: res.msg })
        }
    }
}
