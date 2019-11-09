import React, { Component } from 'react'
import { Modal } from 'antd'
import { connect } from 'react-redux'
import dateUtils from '../../utils/dateUtils'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import { reqWeather } from '../../api'
import { logout } from '../../store/actions'

import './index.less'
class Header extends Component {
    state = {
        currentTime: dateUtils.timestampToTime(Date.now()),
        dayPictureUrl: '',
        weather: ''
    }

    componentDidMount() {
        this.getDateWeather()
        this.getSysTime()
    }
    componentWillUnmount() {
        clearInterval(this.timeId)
    }

    // 获取天气
    getDateWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('深圳')
        this.setState({ dayPictureUrl, weather })
    }

    // 时间动态化
    getSysTime() {
        this.timeId = setInterval(
            () =>
                this.setState({
                    currentTime: dateUtils.timestampToTime(Date.now())
                }),
            1000
        )
    }

    //获取当前组件标题
    getComponentTitle() {
        const path = this.props.location.pathname
        let title = ''
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                let citem = item.children.find(
                    child => path.indexOf(child.key) === 0
                )
                if (citem) {
                    title = citem.title
                }
            }
        })
        return title
    }

    // 退出
    signOut = () => {
        Modal.confirm({
            content: ' 确定退出吗?',
            onOk: () => {
                this.props.logout()
            },
            onCancel() {}
        })
    }

    render() {
        const user = this.props.user
        const { currentTime, dayPictureUrl, weather } = this.state
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎您，{user.username}</span>
                    <LinkButton onClick={this.signOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {/* {this.getComponentTitle()} */}
                        {this.props.headTitle}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span>
                            <img
                                style={{
                                    width: '30px',
                                    height: '20px',
                                    margin: '0 15px'
                                }}
                                src={dayPictureUrl}
                                alt="weather"
                            />
                        </span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({ headTitle: state.headTitle, user: state.user }),
    { logout }
)(withRouter(Header))
