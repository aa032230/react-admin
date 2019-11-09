import React, { Component } from 'react'
import { Modal, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree
class RoleAuthForm extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onCancel: PropTypes.func.isRequired,
        onOk: PropTypes.func.isRequired,
        role: PropTypes.object
    }
    constructor(props) {
        super(props)

        // 根据传入角色的menus生成初始状态
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    /**
     *  根据新传入的role来更新checkedKeys状态
     *  当组件接收到新的属性时自动调用
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    // 获取权限节点树
    getTreeNodes = menuList => {
        return menuList.map(item => {
            return (
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
        })
    }

    // 将post参数提交父组件
    handleOk = () => {
        const { role } = this.props
        const params = {
            menus: this.state.checkedKeys,
            _id: role._id,
            auth_name: role.name,
            auth_time: Date.now()
        }
        this.props.onOk(params)
    }

    // 关闭modal
    handleCancel = () => {
        this.props.onCancel()
    }

    //选中某个node回调
    onCheck = (checkedKeys, info) => {
        this.setState({ checkedKeys })
    }
    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        return (
            <Modal
                title="设置角色权限"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <div>
                    <span>角色名称：</span>
                    <Input
                        value={role.name}
                        disabled
                        style={{ width: '80%' }}
                    />
                </div>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </Modal>
        )
    }
}

export default RoleAuthForm
