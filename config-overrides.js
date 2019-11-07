const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
    // 将antd的组件进行懒加载
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),

    // 更换antd主题
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' }
    })
)
