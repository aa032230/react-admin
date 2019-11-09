import Home from '../home/home'
import Category from '../category/category'
import Product from '../product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Order from '../order/order'

const routes = [
    { path: '/home', component: Home },
    { path: '/product', component: Product },
    { path: '/category', component: Category },
    { path: '/role', component: Role },
    { path: '/user', component: User },
    { path: '/charts/bar', component: Bar },
    { path: '/charts/line', component: Line },
    { path: '/charts/pie', component: Pie },
    { path: '/order', component: Order }
]

export default routes
