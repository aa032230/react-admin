import React, { Component } from 'react'
import { Card, Button, Table, message, Modal, Form, Input, Select } from 'antd'
import {
    getUserList,
    postAddUser,
    postEditUser,
    postDeleteUser
} from '../../api'
import dateUtils from '../../utils/dateUtils'
const { Option } = Select
// 用户
class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roles: [],
            tableData: [],
            loading: true
        }
    }
    componentWillMount() {
        this.initCloums()
        this.rowData = {}
    }
    componentDidMount() {
        this.getList()
    }
    getList = async () => {
        this.setState({ loading: true })
        const res = await getUserList()
        if (res.status === 0) {
            this.setState({
                roles: res.data.roles,
                tableData: res.data.users,
                loading: false,
                isEdit: false
            })
        }
    }
    initCloums() {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: '注册时间',
                key: 'create_time',
                render: scope => (
                    <div>
                        {scope.create_time ? (
                            <span>
                                {dateUtils.timestampToTime(scope.create_time)}
                            </span>
                        ) : null}
                    </div>
                )
            },
            {
                title: '角色名称',
                key: 'role_id',
                render: scope => {
                    const role = this.state.roles.find(
                        role => role._id === scope.role_id
                    )
                    return <div>{role.name}</div>
                }
            },
            {
                title: '操作',
                render: scope => (
                    <div>
                        <Button
                            type="link"
                            onClick={() => {
                                this.showModal(scope)
                            }}
                        >
                            修改
                        </Button>
                        <Button type="link" onClick={() => this.delUser(scope)}>
                            删除
                        </Button>
                    </div>
                )
            }
        ]
    }

    // 关闭模态框
    handleCancel = () => {
        this.setState({ visible: false })
        this.props.form.resetFields()
        this.rowData = {}
    }

    showModal(scope) {
        this.setState({
            isEdit: true,
            visible: true
        })
        this.rowData = scope || {}
    }

    // 添加、修改用户
    handleOk = () => {
        this.props.form.validateFields(async (err, val) => {
            this.setState({ loading: true })
            if (!err) {
                // 修改
                if (this.state.isEdit) {
                    val._id = this.rowData._id
                    const res = await postEditUser(val)
                    if (res.status === 0) {
                        this.getList()
                        this.setState({ loading: false, visible: false })
                        message.success('修改成功')
                    } else {
                        message.error('修改失败')
                        this.setState({ loading: false })
                    }
                } else {
                    //添加
                    const res = await postAddUser(val)
                    if (res.status === 0) {
                        this.getList()
                        this.setState({ loading: false, visible: false })
                        message.success('添加成功')
                    } else {
                        message.error('添加失败')
                        this.setState({ loading: false })
                    }
                }
            }
        })
    }

    // 删除用户
    delUser = scope => {
        Modal.confirm({
            title: '提示：确定要删除这个用户吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                this.setState({ loading: true })
                const res = await postDeleteUser({ userId: scope._id })
                if (res.status === 0) {
                    this.getList()
                    message.success('添加成功')
                } else {
                    message.error('删除失败')
                }
                this.setState({ loading: false })
            }
        })
    }

    //验证手机号
    // 自定义验证
    validatePhonee(rule, value, callback) {
        if (!/^[0-9]*$/.test(value)) {
            callback('手机号必须为数字')
        } else {
            callback()
        }
    }

    render() {
        const { tableData, loading, visible, roles, isEdit } = this.state
        const { columns, rowData } = this
        const title = (
            <Button
                type="primary"
                onClick={() => this.setState({ visible: true, isEdit: false })}
            >
                创建用户
            </Button>
        )
        const formItemLayout = {
            labelCol: {
                span: 3
            },
            wrapperCol: {
                span: 18
            }
        }
        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Card title={title}>
                    <Table
                        rowKey="_id"
                        loading={loading}
                        bordered
                        columns={columns}
                        dataSource={tableData}
                    />
                </Card>
                <Modal
                    title="创建用户"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="用户名">
                            {getFieldDecorator('username', {
                                initialValue: rowData.username,
                                rules: [
                                    { min: 4, message: '用户名不能小于4位' },
                                    { max: 12, message: '用户名不能大于12位' },
                                    {
                                        required: true,
                                        message: '请输入用户名'
                                    }
                                ]
                            })(<Input placeholder="请填写用户名" />)}
                        </Form.Item>
                        {isEdit ? null : (
                            <Form.Item label="密码">
                                {getFieldDecorator('password', {
                                    rules: [
                                        { min: 4, message: '密码不能小于4位' },
                                        {
                                            max: 12,
                                            message: '密码不能大于12位'
                                        }
                                    ]
                                })(<Input.Password placeholder="请填写密码" />)}
                            </Form.Item>
                        )}
                        <Form.Item label="手机号">
                            {getFieldDecorator('phone', {
                                initialValue: rowData.phone,
                                rules: [
                                    { len: 11, message: '手机号码不正确' },
                                    { validator: this.validatePhonee }
                                ]
                            })(<Input placeholder="请填写手机号" />)}
                        </Form.Item>
                        <Form.Item label="邮箱">
                            {getFieldDecorator('email', {
                                initialValue: rowData.email,
                                rules: [
                                    {
                                        type: 'email',
                                        message: '请输入正确邮箱'
                                    }
                                ]
                            })(<Input placeholder="请填写邮箱" />)}
                        </Form.Item>
                        <Form.Item label="角色">
                            {getFieldDecorator('role_id', {
                                initialValue: rowData.role_id,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择角色'
                                    }
                                ]
                            })(
                                <Select placeholder="请选择角色">
                                    {roles.map(item => (
                                        <Option key={item._id} value={item._id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(User)
