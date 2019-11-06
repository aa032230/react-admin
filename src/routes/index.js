import Home from '../pages/home/home'
import Category from '../pages/category/category'
import Product from '../pages/product/product'
import Role from '../pages/role/role'
import User from '../pages/user/user'
import Bar from '../pages/charts/bar'
import Line from '../pages/charts/line'
import Pie from '../pages/charts/pie'

const routes = [
    { path: '/home', component: Home },
    { path: '/product', component: Product },
    { path: '/category', component: Category },
    { path: '/role', component: Role },
    { path: '/user', component: User },
    { path: '/charts/bar', component: Bar },
    { path: '/charts/line', component: Line },
    { path: '/charts/pie', component: Pie }
]

export default routes
