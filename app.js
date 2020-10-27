var bodyParser = require('body-parser')
var express = require('express')
var path = require('path')
var session = require('express-session')
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

//使用保存在服务器的express-session来保存用户状态信息 
app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'ironMan',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  }))

// 把路由挂载到app中
app.use(router)

// 配置处理404的中间件
app.use((req, res) => {
    res.render('404.html')
})

// 配置一个全局错误处理的中间件
app.use((err, req, res, next) => {
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
})

app.listen(5000, () => {
    console.log('running...')
})
