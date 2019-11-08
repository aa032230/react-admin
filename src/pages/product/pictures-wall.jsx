import React from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import PropTypes from 'prop-types'
import { postDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constant'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}
// 图片上传组件
class PicturesWall extends React.Component {
    constructor(props) {
        super(props)
        let fileList = []
        const { imgs } = this.props

        // 编辑状态获取图片
        if (imgs && imgs.length) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList
        }
    }
    static propTypes = {
        imgs: PropTypes.array
    }
    handleCancel = () => {
        this.setState({ previewVisible: false })
    }

    // 显示指定file的大图
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true
        })
    }

    /**
     *  file : 当前操作的图片
     *  fileList : 所有已上传的图片数组
     */
    handleChange = async ({ file, fileList }) => {
        // 上传成功
        if (file.status === 'done') {
            const res = file.response
            if (res.status === 0) {
                message.success('图片上传成功')
                const { name, url } = res.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('图片上传失败')
            }
        } else if (file.status === 'removed') {
            // 删除图片
            const res = await postDeleteImg({ name: file.name })
            if (res.status === 0) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        }

        this.setState({ fileList })
    }

    // 获取所有上传图片的文件名
    getImages = () => {
        return this.state.fileList.map(file => file.name)
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"
                    accept="image/*" // 只接收图片格式
                    name="image" // 请求参数名
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img
                        alt="example"
                        style={{ width: '100%' }}
                        src={previewImage}
                    />
                </Modal>
            </div>
        )
    }
}

export default PicturesWall
