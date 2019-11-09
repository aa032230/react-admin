/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig'
import { setHeadTitle } from '../../store/actions'
import './index.less'
const { SubMenu } = Menu
// 左侧页面菜单
class siderMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillMount() {
        this.menuArr = this.getMenuNodes(menuList)
    }
    render() {
        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        console.log('render()', path)
        if (path.indexOf('/product') === 0) {
            // 当前请求的是商品或其子路由界面
            path = '/product'
        }
        return (
            <div className="menu">
                <Link to="/" className="menu-header">
                    <h1>REACT 后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuArr}
                </Menu>
            </div>
        )
    }
    /*
  判断当前登陆用户对item是否有权限
   */
    hasAuth = item => {
        const { key, isPublic } = item

        const menus = this.props.user.role.menus
        const username = this.props.user.username
        /*
            1. 如果当前用户是admin
            2. 如果当前item是公开的
            3. 当前用户有此item的权限: key有没有menus中
         */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            // 4. 如果当前用户有此item的某个子item的权限
            return !!item.children.find(
                child => menus.indexOf(child.key) !== -1
            )
        }

        return false
    }
    // 根据数据生成菜单节点
    getMenuNodes = menuList => {
        const path = this.props.location.pathname
        return menuList.map(item => {
            if (this.hasAuth(item)) {
                if (item.children) {
                    const cItem = item.children.find(
                        cItem => path.indexOf(cItem.key) === 0
                    )
                    if (cItem) {
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                } else {
                    if (path.indexOf(item.key) === 0) {
                        this.props.setHeadTitle(item.title)
                    }
                    return (
                        <Menu.Item key={item.key}>
                            <Link
                                to={item.key}
                                onClick={() =>
                                    this.props.setHeadTitle(item.title)
                                }
                            >
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }
            }
        })
    }
}
/**
 * withRouter高阶组件
 * 包装非路由组件，返回一个新的组件
 * 新的组件向非路由传递三个属性 : history/Loaction/math
 */
export default connect(
    state => ({ user: state.user }),
    { setHeadTitle }
)(withRouter(siderMenu))
