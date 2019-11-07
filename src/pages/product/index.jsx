import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import routes from './routes'
import './index.less'
class productIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <Switch>
                {routes.map((item, index) => (
                    <Route
                        key={index}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                    />
                ))}
                <Redirect to="/product" />
            </Switch>
        )
    }
}

export default productIndex
