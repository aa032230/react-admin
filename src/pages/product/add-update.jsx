import React, { Component } from 'react'
import { Card, Button, Form, Input, Cascader } from 'antd'
import PicturesWall from './pictures-wall'
import { getCategoryList } from '../../api'
const { TextArea } = Input

class ProductAddUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            parentId: 0
        }

        this.pic = React.createRef()
    }
    async componentDidMount() {
        this.options = await this.getCategory()
    }
    componentWillMount() {
        const product = this.props.location.state
        this.product = product || {}
        this.isEdit = !!product
    }

    // 初始分类数据
    initCategory = categorys => {
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))

        // 编辑商品获取二级列表
        const { product, isEdit } = this
        const { pCategoryId } = product
        if (isEdit && pCategoryId !== '0') {
            this.setState({ parentId: pCategoryId }, async () => {
                const sub = await this.getCategory()
                const child = sub.map(c => ({ value: c._id, label: c.name }))
                // 获取当前商品对应的一级option 对象
                const targetOption = options.find(
                    option => option.value === pCategoryId
                )
                targetOption.children = child
                this.setState({ options })
            })
        } else {
            this.setState({ options })
        }
    }

    // 获取分类
    getCategory = async () => {
        const { parentId } = this.state
        const res = await getCategoryList({ parentId })

        if (res.status === 0) {
            if (parentId === 0) {
                this.initCategory(res.data)
            } else {
                return res.data
            }
        }
    }

    // 提交表单
    handleSubmit = () => {
        this.props.form.validateFields((err, val) => {
            if (!err) {
                const img = this.pic.current.getImages()
                console.log(val)
            }
        })
    }

    // 验证价格
    handleValidetePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('价格必须大于0')
        }
    }
    // 加载子类
    loadData = selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true
        this.setState({ parentId: targetOption.value }, async () => {
            const sub = await this.getCategory()
            if (sub && sub.length) {
                targetOption.children = sub.map(c => ({
                    label: c.name,
                    value: c._id
                }))
            } else {
                targetOption.isLeaf = true // 没有二级分类
            }
            targetOption.loading = false

            this.setState({
                options: [...this.state.options]
            })
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { options } = this.state
        const formItemLayout = {
            labelCol: {
                span: 2
            },
            wrapperCol: {
                span: 8
            }
        }
        const { product, isEdit } = this
        const { pCategoryId, categoryId } = product
        const categoryIds = []
        if (pCategoryId === 0) {
            categoryIds.push(categoryId)
        } else {
            categoryIds.push(pCategoryId, categoryId)
        }
        const title = (
            <div>
                <Button
                    onClick={() => this.props.history.goBack()}
                    type="link"
                    icon="arrow-left"
                ></Button>
                <span>{isEdit ? '编辑商品' : '添加商品'}</span>
            </div>
        )
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Form.Item label="商品名称：">
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                                { required: true, message: '请输入商品名称' }
                            ]
                        })(<Input placeholder="商品名称" />)}
                    </Form.Item>
                    <Form.Item label="商品描述：">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                { required: true, message: '请输入商品描述' }
                            ]
                        })(
                            <TextArea
                                placeholder="Autosize height based on content lines"
                                autoSize
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="商品价格：">
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                { required: true, message: '请输入商品价格' },
                                { validator: this.handleValidetePrice }
                            ]
                        })(<Input type="number" addonAfter="元" />)}
                    </Form.Item>
                    <Form.Item label="商品分类：">
                        {getFieldDecorator('cids', {
                            initialValue: categoryIds,
                            rules: [
                                { required: true, message: '请指定商品分类' }
                            ]
                        })(
                            <Cascader
                                placeholder="请选择商品分类"
                                options={options}
                                loadData={this.loadData}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="商品图片：">
                        <PicturesWall ref={this.pic} imgs={product.imgs} />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            style={{ marginLeft: '30%' }}
                            type="primary"
                            onClick={this.handleSubmit}
                        >
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)
