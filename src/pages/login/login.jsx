import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button } from 'antd'
import { connect } from 'react-redux'
import { login } from '../../store/actions'
import './login.less'

// 登录
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        const user = this.props.user
        // 登录跳转首页
        if (user && user._id) {
            return <Redirect to="/home" />
        }
        const Item = Form.Item
        const { getFieldDecorator } = this.props.form
        return (
            <div className="login">
                <header className="login-header">
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <div
                        className={
                            user.errorMsg ? 'error-msg show' : 'error-msg'
                        }
                    >
                        {user.errorMsg}
                    </div>
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: '请输入用户名'
                                    },
                                    { min: 4, message: '用户名不能小于4位' },
                                    { max: 12, message: '用户名不能大于12位' },
                                    {
                                        pattern: /^[a-zA-z0-9_]+$/,
                                        message:
                                            '用户名必须由英文、数字或下划线组成'
                                    }
                                ]
                            })(
                                <Input
                                    prefix={
                                        <Icon
                                            type="user"
                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                        />
                                    }
                                    placeholder="用户名"
                                />
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [{ validator: this.validatePwd }]
                            })(
                                <Input
                                    prefix={
                                        <Icon
                                            type="lock"
                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                        />
                                    }
                                    type="password"
                                    placeholder="密码"
                                />
                            )}
                        </Item>
                        <Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                登 陆
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.props.login(values)
            } else {
                console.log('校验失败')
            }
        })
    }

    // 自定义验证
    validatePwd(rule, value, callback) {
        if (!value) {
            callback('密码不能为空')
        } else if (value.length < 4) {
            callback('密码不能小于4位')
        } else if (value.length > 12) {
            callback('密码不能大于12位')
        } else if (!/^[a-zA-z0-9_]+$/.test(value)) {
            callback('密码必须由英文、数字或下划线组成')
        } else {
            callback()
        }
    }
}
const WrapLogin = Form.create()(Login)

export default connect(
    state => ({ user: state.user }),
    { login }
)(WrapLogin)
