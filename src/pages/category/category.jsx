import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    Select,
    Input,
    Breadcrumb,
    Form,
    message
} from 'antd'
import Hidden from '../../components/hidden'
import { getCategoryList, addCategory, updateCategroy } from '../../api'
const { Option } = Select
// 分类
class Category extends Component {
    state = {
        tableData: [],
        columns: [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: '_id',
                align: 'center'
            },
            {
                title: '操作',
                width: 300,
                align: 'center',
                render: scope => (
                    <span>
                        <Button
                            type="link"
                            onClick={() => {
                                this.showeditMoadl(scope)
                            }}
                        >
                            修改分类
                        </Button>
                        <Hidden visible={this.state.parentId === 0} tag="span">
                            <Button
                                type="link"
                                onClick={() => this.showSubCategory(scope)}
                            >
                                查看子分类
                            </Button>
                        </Hidden>
                    </span>
                )
            }
        ],
        visible: false,
        options: [],
        loadingFlag: true,
        parentId: 0,
        parentName: '',
        subData: [],
        showStatus: 0 // 1为更新2为添加
    }
    componentDidMount() {
        this.getList()
    }

    //显示编辑分类框
    showeditMoadl(row) {
        this.setState({ visible: true, showStatus: 2 })
        this.row = row
    }

    //显示当前节点的子分类
    showSubCategory = row => {
        this.setState({ parentId: row._id, parentName: row.name }, () => {
            this.getList()
        })
    }

    // 获取列表
    getList = async () => {
        const { parentId } = this.state
        const res = await getCategoryList({ parentId })
        if (res.status === 0) {
            if (parentId === 0) {
                this.setState({ tableData: res.data, loadingFlag: false })
            } else {
                this.setState({ subData: res.data, loadingFlag: false })
            }
        }
    }
    // 返回父级节点
    toParentCategory = () => {
        this.setState({ parentId: 0, parentName: '', subData: [] })
    }
    // 添加 or 修改分类
    addOrEditCategory = async () => {
        const { showStatus } = this.state
        const params = this.props.form.getFieldsValue()
        // 添加
        if (showStatus === 1) {
            const res = await addCategory(params)
            if (res.status === 0) {
                this.setState({ visible: false }, () => {
                    message.success('添加成功')
                    this.getList()
                })
            }
        } else {
            // 修改
            const res = await updateCategroy({
                categoryId: this.row._id,
                categoryName: params.categoryName
            })
            if (res.status === 0) {
                this.setState({ visible: false }, () => {
                    message.success('更新成功')
                    this.getList()
                })
            }
        }
    }
    handleChange = () => {}
    render() {
        const {
            columns,
            tableData,
            loadingFlag,
            parentName,
            parentId,
            subData,
            showStatus
        } = this.state
        const title = (
            <Breadcrumb>
                <Breadcrumb.Item>
                    {parentId === 0 ? (
                        '一级分类'
                    ) : (
                        <Button type="link" onClick={this.toParentCategory}>
                            一级分类
                        </Button>
                    )}
                </Breadcrumb.Item>
                {parentId === 0 ? null : (
                    <Breadcrumb.Item>{parentName}</Breadcrumb.Item>
                )}
            </Breadcrumb>
        )
        const extra = (
            <Button
                onClick={() => this.setState({ visible: true, showStatus: 1 })}
                type="primary"
                icon="plus"
            >
                添加
            </Button>
        )

        const { getFieldDecorator } = this.props.form
        return (
            <div className="category">
                <Card title={title} extra={extra}>
                    <Table
                        rowKey="_id"
                        bordered
                        loading={loadingFlag}
                        columns={columns}
                        pagination={{ hideOnSinglePage: true }}
                        dataSource={parentId === 0 ? tableData : subData}
                    />
                </Card>
                <Modal
                    title={showStatus === 1 ? '添加分类' : '修改分类'}
                    visible={this.state.visible}
                    onOk={this.addOrEditCategory}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <Form>
                        <Hidden visible={showStatus === 1}>
                            <Form.Item>
                                {getFieldDecorator('parentId', {
                                    initialValue: '0'
                                })(
                                    <Select
                                        style={{
                                            width: '100%',
                                            marginBottom: '15px'
                                        }}
                                        onChange={this.handleChange}
                                    >
                                        <Option key="0" value="0">
                                            一级分类
                                        </Option>
                                        {tableData.map(item => (
                                            <Option
                                                key={item._id}
                                                value={item._id}
                                            >
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Hidden>

                        <Form.Item>
                            {getFieldDecorator('categoryName', {
                                initialValue:
                                    showStatus === 2 ? this.row.name : ''
                            })(<Input placeholder="请输入分类名称" />)}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(Category)
