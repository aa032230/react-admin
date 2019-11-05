import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
class admin extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const user = memoryUtils.user
        // 没有登录跳转login
        if (!user || !user._id) {
            return <Redirect to="/login" />
        }
        return <div>{user.username}</div>
    }
}

export default admin
