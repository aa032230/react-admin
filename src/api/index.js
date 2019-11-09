import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

// 登录
export const reqLogin = params => ajax('/login', params, 'post')

// 获取分类列表
export const getCategoryList = params => ajax('/manage/category/list', params)

// 添加分类
export const addCategory = params =>
    ajax('/manage/category/add', params, 'post')

// 更新分类名称
export const updateCategroy = params =>
    ajax('/manage/category/update', params, 'post')

// 根据分类ID获取分类
export const getCategoryInfoById = params =>
    ajax('/manage/category/info', params)

// 获取商品列表
export const getProductList = params => ajax('/manage/product/list', params)

// 修改商品状态
export const updateProductStatus = params =>
    ajax('/manage/product/updateStatus', params, 'post')

// 添加商品
export const addPorduct = params => ajax('/manage/product/add', params, 'post')

// 编辑商品
export const updatePorduct = params =>
    ajax('/manage/product/update', params, 'post')

// 删除商品图片
export const postDeleteImg = params =>
    ajax('/manage/img/delete', params, 'post')

// 根据搜索条件获取商品
export const getSearchProduct = params => ajax('/manage/product/search', params)

// 获取角色列表
export const getRoleList = () => ajax('/manage/role/list')

// 添加角色
export const postAddRole = params => ajax('/manage/role/add', params, 'post')

// 更新角色权限
export const postUpdateRole = params =>
    ajax('/manage/role/update', params, 'post')

//jsonp请求天气
export const reqWeather = city => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    return new Promise((resolve, reject) => {
        jsonp(url, { param: 'callback' }, (err, res) => {
            if (!err) {
                const {
                    dayPictureUrl,
                    weather
                } = res.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else {
                message.error('获取天气失败')
            }
        })
    })
}
