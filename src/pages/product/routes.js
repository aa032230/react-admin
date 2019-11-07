import ProductAddUpdate from './add-update'
import Product from './product'
import ProductDetail from './detail'

export default [
    { path: '/product/addUpdate', component: ProductAddUpdate, exact: false },
    { path: '/product', component: Product, exact: true },
    { path: '/product/detail', component: ProductDetail, exact: false }
]
