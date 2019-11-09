import storageUtils from '../utils/storageUtils'
import { combineReducers } from 'redux'
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './actionType'
const initTitle = '首页'
/**
 * 管理头部标题的reducer函数
 */
function headTitle(state = initTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.title

        default:
            return state
    }
}

const initUserData = storageUtils.getStore('userData')
/**
 * 保存当前登录用户数据reducer函数
 */
function user(state = initUserData, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const errorMsg = action.data
            return { ...state, errorMsg }
        case RESET_USER:
            return {}
        default:
            return state
    }
}

// 暴露合并后的reducer函数
export default combineReducers({
    headTitle,
    user
})
