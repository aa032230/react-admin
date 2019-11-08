import React, { Component } from 'react'
import { Card, Button, Form, Input, Cascader, message } from 'antd'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import { getCategoryList, addPorduct, updatePorduct } from '../../api'
const { TextArea } = Input

class ProductAddUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            parentId: 0
        }

        this.pic = React.createRef()
        this.editor = React.createRef()
    }
    async componentDidMount() {
        this.options = await this.getCategory(0)
    }
    componentWillMount() {
        const product = this.props.location.state
        this.product = product || {}
        this.isEdit = !!product
    }

    // 初始分类数据
    initCategory = async categorys => {
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))

        // 编辑商品获取二级列表
        const { product, isEdit } = this
        const { pCategoryId } = product
        if (isEdit && pCategoryId !== '0') {
            const sub = await this.getCategory(pCategoryId)
            const child = sub.map(c => ({ value: c._id, label: c.name }))
            // 获取当前商品对应的一级option 对象
            const targetOption = options.find(
                option => option.value === pCategoryId
            )
            targetOption.children = child
            this.setState({ options })
        }

        this.setState({ options })
    }

    // 获取分类
    getCategory = async parentId => {
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
        // |categoryId    |Y       |string   |分类ID
        // |pCategoryId   |Y       |string   |父分类ID
        // |name          |Y       |string   |商品名称
        // |desc          |N       |string   |商品描述
        // |price         |N       |string   |商品价格
        // |detail        |N       |string   |商品详情
        // |imgs          |N       |array   |商品图片名数组
        this.props.form.validateFields(async (err, val) => {
            if (!err) {
                console.log(val)
                const imgs = this.pic.current.getImages()
                const detail = this.editor.current.getDetail()
                let pCategoryId, categoryId
                if (val.cids.length === 1) {
                    pCategoryId = '0'
                    categoryId = val.cids[0]
                } else {
                    ;[pCategoryId, categoryId] = val.cids
                }

                console.log(pCategoryId, categoryId)
                const parmas = {
                    imgs,
                    detail,
                    pCategoryId,
                    categoryId,
                    name: val.name,
                    desc: val.desc,
                    price: val.price
                }
                if (this.isEdit) {
                    //修改
                    // 添加
                    const res = await updatePorduct(parmas)
                    if (res.status === 0) {
                        message.success('修改成功')
                        this.props.history.goBack()
                    }
                } else {
                    // 添加
                    const res = await addPorduct(parmas)
                    if (res.status === 0) {
                        message.success('添加成功')
                        this.props.history.goBack()
                    }
                }
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
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true

        const sub = await this.getCategory(targetOption.value)
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
        if (pCategoryId === '0') {
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

                    <Form.Item
                        label="商品详情："
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <RichTextEditor
                            ref={this.editor}
                            detail={product.detail}
                        />
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
