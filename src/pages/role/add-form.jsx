import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'
import PropTypes from 'prop-types'

class RoleAddForm extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func.isRequired,
        onOk: PropTypes.func.isRequired
    }
    handleOk = () => {
        this.props.form.validateFields(async (err, val) => {
            if (!err) {
                this.props.onOk(val)
            }
        })
    }
    handleCancel = () => {
        this.props.form.resetFields()
        this.props.onCancel()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Modal
                title="添加角色"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Form>
                    <Form.Item
                        label="角色名称："
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('roleName', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入角色名称'
                                }
                            ]
                        })(<Input placeholder="角色名称" />)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(RoleAddForm)
