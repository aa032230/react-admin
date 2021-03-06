import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import SiderMenu from '../../components/siderMenu'
import Header from '../../components/header'
import routes from './routes'
// 主页
class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const { Footer, Sider, Content } = Layout
        const user = this.props.user
        // 没有登录跳转login
        if (!user || !user._id) {
            return <Redirect to="/login" />
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <SiderMenu />
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content
                        style={{ backgroundColor: '#fff', margin: '20px' }}
                    >
                        <Switch>
                            {/* 生成路由 */}
                            {routes.map((route, key) => (
                                <Route
                                    key={key}
                                    path={route.path}
                                    component={route.component}
                                />
                            ))}
                            <Redirect to="/home" />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#ccc' }}>
                        推荐使用谷歌浏览器，可以获得更佳页面操作体验
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    {}
)(Admin)
