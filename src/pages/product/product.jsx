import React, { Component } from 'react'
import { Card, Button, Table, Input, Form, Select, message } from 'antd'
import {
    getProductList,
    updateProductStatus,
    getSearchProduct
} from '../../api'
// 商品
class Product extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            total: 0,
            pageNum: 1,
            pageSize: 5,
            loading: true,
            searchName: '',
            searchType: 'productName'
        }
    }
    componentWillMount() {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
                align: 'center'
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: (status, scope) => {
                    const btnText = status === 1 ? '下架' : '上架'
                    const statusTex = status === 1 ? '在售' : '已下架'
                    return (
                        <div>
                            <div style={{ marginBottom: '5px' }}>
                                {statusTex}
                            </div>
                            <Button
                                onClick={() => this.handleChangleStatus(scope)}
                                type="primary"
                            >
                                {btnText}
                            </Button>
                        </div>
                    )
                }
            },
            {
                title: '操作',
                width: 200,
                align: 'center',
                render: product => (
                    <span>
                        <Button
                            type="link"
                            onClick={() =>
                                this.props.history.push('/product/detail', {
                                    product
                                })
                            }
                        >
                            详情
                        </Button>
                        <Button
                            type="link"
                            onClick={() =>
                                this.props.history.push(
                                    '/product/addUpdate',
                                    product
                                )
                            }
                        >
                            修改
                        </Button>
                    </span>
                )
            }
        ]
    }
    componentDidMount() {
        this.getList()
    }

    async handleChangleStatus(scope) {
        const status = scope.status === 1 ? 2 : 1
        const res = await updateProductStatus({ productId: scope._id, status })
        if (res.status === 0) {
            message.success('修改成功')
            this.getList()
        }
    }

    // 列表
    async getList() {
        const { pageNum, pageSize, searchName, searchType } = this.state
        this.setState({ loading: true })
        let res
        if (searchName) {
            res = await getSearchProduct({
                pageNum,
                pageSize,
                [searchType]: searchName
            })
        } else {
            res = await getProductList({ pageNum, pageSize })
        }
        if (res && res.status === 0) {
            this.setState({
                tableData: res.data.list,
                total: res.data.total,
                loading: false
            })
        }
    }

    // 分页
    handleCurrentPage = (pageNum, pageSize) => {
        console.log(pageNum, pageSize)
        this.setState({ pageNum, pageSize }, () => {
            this.getList()
        })
    }

    render() {
        const extra = (
            <Button
                onClick={() => this.props.history.push('/product/addUpdate')}
                type="primary"
                icon="plus"
            >
                添加商品
            </Button>
        )
        const title = (
            <Form
                style={{ display: 'flex' }}
                onSubmit={this.handleSubmitSearch}
            >
                <Form.Item>
                    <Select
                        style={{ width: 130 }}
                        defaultValue="productName"
                        onChange={val => this.setState({ searchType: val })}
                    >
                        <Select.Option value="productName">
                            按名称搜索
                        </Select.Option>
                        <Select.Option value="productDesc">
                            按描述搜索
                        </Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ margin: '0 15px' }}>
                    <Input
                        style={{ width: 200 }}
                        onChange={e =>
                            this.setState({ searchName: e.target.value })
                        }
                        placeholder="关键字"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        onClick={() =>
                            this.setState({ pageNum: 1 }, () => this.getList())
                        }
                        type="primary"
                    >
                        搜索
                    </Button>
                </Form.Item>
            </Form>
        )
        const { tableData, total, pageNum, pageSize, loading } = this.state
        return (
            <div className="product">
                <Card title={title} extra={extra}>
                    <Table
                        rowKey="_id"
                        bordered
                        dataSource={tableData}
                        columns={this.columns}
                        loading={loading}
                        pagination={{
                            current: pageNum,
                            total: total,
                            pageSize: pageSize,
                            onChange: (pageNum, pageSize) => {
                                this.handleCurrentPage(pageNum, pageSize)
                            }
                        }}
                    />
                </Card>
            </div>
        )
    }
}

export default Product
