import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// 商品详情富文本编辑组件
export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }
    constructor(props) {
        super(props)
        const html = this.props.detail
        // 编辑状态获取数据
        if (html) {
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(
                    contentBlock.contentBlocks
                )
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState
                }
            }
            // 添加
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            }
        }
    }

    // 更新文本
    onEditorStateChange = editorState => {
        this.setState({
            editorState
        })
    }

    // 将当期输入文本返回父组件
    getDetail = () => {
        const { editorState } = this.state
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    // editor图片上传
    uploadImageCallBack = file => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/manage/img/upload')
            const data = new FormData()
            data.append('image', file)
            xhr.send(data)
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText)
                resolve({ data: { url: response.data.url } })
            })
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText)
                reject(error)
            })
        })
    }

    render() {
        const { editorState } = this.state
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    toolbar={{
                        image: {
                            uploadCallback: this.uploadImageCallBack,
                            alt: { present: true, mandatory: true }
                        }
                    }}
                    editorStyle={{
                        border: '1px solid #666',
                        minHeight: 200,
                        paddingLeft: 10
                    }}
                    onEditorStateChange={this.onEditorStateChange}
                />
                {/* <textarea
                    disabled
                    value={}
                /> */}
            </div>
        )
    }
}
