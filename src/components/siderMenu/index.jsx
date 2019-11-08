import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig'
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
        let path = this.props.location.pathname
        const path2 = '/' + path.split('/')[1]
        //当前请求的路由及其子路由匹配
        if (path.indexOf(path2) === 0) {
            path = path2
        }
        return (
            <div className="menu">
                <Link to="/" className="menu-header">
                    <h1>REACT 后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={this.openKey}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuArr}
                </Menu>
            </div>
        )
    }

    // 根据数据生成菜单节点
    getMenuNodes = menuList => {
        const path = this.props.location.pathname
        return menuList.map(item => {
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
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }
        })
    }
}
/**
 * withRouter高阶组件
 * 包装非路由组件，返回一个新的组件
 * 新的组件向非路由传递三个属性 : history/Loaction/math
 */
export default withRouter(siderMenu)
