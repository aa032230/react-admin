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
    render() {
        const path = this.props.location.pathname
        return (
            <div className="menu">
                <Link to="/" className="menu-header">
                    <h1>REACT 后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                >
                    {this.getMenuNodes(menuList)}
                </Menu>
            </div>
        )
    }

    // 根据数据生成菜单节点 map版
    getMenuNodes_map = menuList => {
        return menuList.map(item => {
            if (item.children) {
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

    // reduce版
    getMenuNodes = menuList => {
        return menuList.reduce((pre, item) => {
            if (item.children) {
                pre.push(
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
                pre.push(
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }

            return pre
        }, [])
    }
}
/**
 * withRouter高阶组件
 * 包装非路由组件，返回一个新的组件
 * 新的组件向非路由传递三个属性 : history/Loaction/math
 */
export default withRouter(siderMenu)
