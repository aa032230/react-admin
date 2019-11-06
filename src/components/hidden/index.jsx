import React, { Component } from 'react'

export default class Hidden extends Component {
    render() {
        const { visible, children, tag = 'div', ...rest } = this.props
        const content = visible ? children : null
        return React.createElement(tag, rest, content)
    }
}
