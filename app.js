const bodyParser = require('body-parser')
var express = require('express')
var path = require('path')
var router = require('./router')

var app = express()

app.use('/public', express.static(path.join(__dirname, './public')))
app.use('/node_modules/', express.static(path.join(__dirname, 'node_modules/')))

// 模板引擎 
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))

//中间件-配置解析表单POST请求体插件 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 把路由挂载到app中
app.use(router)

app.listen(5000, () => {
    console.log('running...')
})