import axios from 'axios'
import { message } from 'antd'

axios.defaults.baseURL = ''
export default function ajax(url, params = {}, type = 'GET') {
    return new Promise((reslove, reject) => {
        let promise
        if (type.toUpperCase() === 'GET') {
            promise = axios.get(url, { params })
        } else if (type.toUpperCase() === 'POST') {
            promise = axios.post(url, params)
        }

        promise
            .then(res => {
                reslove(res.data)
            })
            .catch(err => {
                message.error('请求出错了: ' + err.message)
            })
    })
}
