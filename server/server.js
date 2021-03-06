const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const favicon = require('serve-favicon')
const path = require('path')
const app = express()
const isDev = process.env.NODE_ENV === 'development'

app.use(favicon(path.join(__dirname, '../favicon.ico')))

if (!isDev) {
    const serverEntry = require('../dist/server-entry').default
    const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
    app.use('/public', express.static(path.join(__dirname, '../dist')))
    // 通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
    app.get('*', function (req, res) {
        const appString = ReactSSR.renderToString(serverEntry)
        res.send(template.replace('<app></app>', appString))
    })
} else {
    const devStatic = require('./utils/dev-static');
    devStatic(app)
}

app.listen(3333, function () {
    console.log('server is listening on 3333')
})