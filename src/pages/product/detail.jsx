import React, { Component } from 'react'
import { Card, List, Button } from 'antd'
import { getCategoryInfoById } from '../../api'
const Item = List.Item
const BASEURL = 'http://localhost:5000/upload/'
class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cname1: '',
            cname2: ''
        }
    }
    componentDidMount() {
        this.getCateNameById()
    }
    getCateNameById = async () => {
        const { categoryId, pCategoryId } = this.props.location.state.product
        if (pCategoryId === '0') {
            const res = await getCategoryInfoById({ categoryId })
            this.setState({ cname1: res.data.name })
        } else {
            const res1 = await getCategoryInfoById({ categoryId: pCategoryId })
            const res2 = await getCategoryInfoById({ categoryId })
            this.setState({ cname1: res1.data.name, cname2: res2.data.name })
        }
    }
    render() {
        const title = (
            <div>
                <Button
                    onClick={() => this.props.history.goBack()}
                    type="link"
                    icon="arrow-left"
                ></Button>
                <span>商品详情</span>
            </div>
        )

        const { product } = this.props.location.state
        const { cname1, cname2 } = this.state
        return (
            <Card title={title} className="product-detail">
                <List className="product-detail-list">
                    <Item>
                        <h2>商品名称：</h2>
                        <p>{product.name}</p>
                    </Item>
                    <Item>
                        <h2>商品描述：</h2>
                        <p>充气娃娃</p>
                    </Item>
                    <Item>
                        <h2>商品价格：</h2>
                        <p>{product.price}元</p>
                    </Item>
                    <Item>
                        <h2>所属分类：</h2>
                        {cname2 ? (
                            <p>
                                {cname1}-->{cname2}
                            </p>
                        ) : (
                            <p>{cname1}</p>
                        )}
                    </Item>
                    <Item>
                        <h2>商品图片：</h2>
                        {product.imgs.map(item => (
                            <img
                                key={item}
                                style={{ width: '80px', height: '80px' }}
                                src={BASEURL + item}
                                alt="item"
                            />
                        ))}
                    </Item>
                    <Item>
                        <h2>商品详情：</h2>
                        <div
                            dangerouslySetInnerHTML={{ __html: product.detail }}
                        ></div>
                    </Item>
                </List>
            </Card>
        )
    }
}

export default Detail
