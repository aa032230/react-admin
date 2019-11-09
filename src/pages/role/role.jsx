import React, { Component } from 'react'
import { Card, Button, Table, message } from 'antd'
import { connect } from 'react-redux'
import { getRoleList, postAddRole, postUpdateRole } from '../../api'
import RoleAddForm from './add-form'
import RoleAuthForm from './auth-from'
import dateUtils from '../../utils/dateUtils'
import { logout } from '../../store/actions'
// 角色
class Role extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            role: {},
            visible: false,
            loading: true,
            isShowAuth: false,
            isDisable: true
        }
    }
    componentWillMount() {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '创建时间',
                key: 'create_time',
                render: scope =>
                    scope.create_time ? (
                        <span>
                            {dateUtils.timestampToTime(scope.create_time)}
                        </span>
                    ) : null
            },
            {
                title: '授权时间',
                key: 'auth_time',
                render: scope =>
                    scope.auth_time ? (
                        <span>
                            {dateUtils.timestampToTime(scope.auth_time)}
                        </span>
                    ) : null
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name'
            }
        ]
    }

    componentDidMount() {
        this.getList()
    }

    // 获取列表
    async getList() {
        this.setState({ loading: true })
        const res = await getRoleList()
        if (res.status === 0) {
            this.setState({
                tableData: res.data,
                loading: false
            })
        }
    }

    onRow = role => {
        return {
            onClick: e => {
                this.setState({
                    role
                })
            }
        }
    }

    //添加角色
    onOk = async role => {
        const res = await postAddRole(role)
        if (res.status === 0) {
            message.success('添加成功')
            this.setState(state => ({
                visible: false,
                tableData: [...state.tableData, res.data]
            }))
        }
    }

    //显示角色权限modal
    showRoleAuth = () => {
        this.setState({ isShowAuth: true })
    }

    // 更新权限
    submitCheckedNodes = async nodes => {
        const res = await postUpdateRole(nodes)
        if (res.status === 0) {
            message.success('权限更新成功')
            // 如果更新的是自己的权限，强制退出
            if (nodes._id === this.props.user._id) {
                this.props.logout()
            } else {
                this.setState({ isShowAuth: false, role: res.data })
            }
        }
    }

    render() {
        const { tableData, role, loading, visible, isShowAuth } = this.state
        const { columns } = this
        const title = (
            <div>
                <Button
                    type="primary"
                    onClick={() => this.setState({ visible: true })}
                >
                    创建角色
                </Button>
                <Button
                    type="primary"
                    disabled={!role._id}
                    style={{ margin: '0 10px' }}
                    onClick={this.showRoleAuth}
                >
                    设置角色权限
                </Button>
            </div>
        )

        return (
            <div>
                <Card title={title}>
                    <Table
                        rowKey="_id"
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys: [role._id],
                            onSelect: role => {
                                this.setState({ role })
                            }
                        }}
                        loading={loading}
                        bordered
                        columns={columns}
                        dataSource={tableData}
                        onRow={this.onRow}
                    />
                </Card>
                <RoleAddForm
                    visible={visible}
                    onCancel={() => {
                        this.setState({ visible: false })
                    }}
                    onOk={form => this.onOk(form)}
                />
                <RoleAuthForm
                    visible={isShowAuth}
                    onCancel={() => {
                        this.setState({ isShowAuth: false })
                    }}
                    role={role}
                    onOk={nodes => this.submitCheckedNodes(nodes)}
                />
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.user
    }),
    { logout }
)(Role)
