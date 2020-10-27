var express = require('express')
var User = require('./models/user')
var router = express.Router()
var md5 = require('blueimp-md5')

// 进入主页
router.get('/', (req, res) => {
    res.render('index.html', {
        user: req.session.user
    })
})

// 进入登录页面 
router.get('/login', (req, res) => {
    res.render('login.html')
})

// 用户登录
router.post('/login', (req, res, next) => {
    var body = req.body

    User.findOne({
        email: body.email,
        password: md5(body.password)
    }, (err, user) => {
        if (err) return next(err)
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }
        //用户存在，登录成功，通过Session记录登录状态
        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

// 进入注册页面
router.get('/register', (req, res) => {
    res.render('register.html')
})

// 注册新用户
router.post('/register', (req, res, next) => {
    // 1. 获取表单提交的数据 req.body
    // 2. 操作数据库  判断该用户是否存在 如果已存在，不允许注册；如果不存在，注册新建用户
    // 3. 发送响应
    var body = req.body
    User.findOne({
        $or: [{
            email: body.email
        },
        {
            nickname: body.nickname
        }
        ]
    }, function (err, data) {
        if (err) {
            // return res.status(500).json({
            //   success: false,
            //   message: '服务端错误'
            // })
            return next(err)
        }
        if (data) {
            // 邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname aleady exists.'
            })
            return res.send(`邮箱或者密码已存在，请重试`)
        }

        // 对密码进行 md5 加密
        body.password = md5(body.password)

        new User(body).save(function (err, user) {
            if (err) {
                return next(err)
            }

            // 注册成功，使用 Session 记录用户的登陆状态
            req.session.user = user

            // Express 提供了一个响应方法：json
            // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })

            // 服务端重定向只针对同步请求才有效，异步请求无效
            // res.redirect('/')
        })
    })
})

//退出 
router.get('/logout', (req, res) => {
    //清除登录状态
    req.session.user = null 

    //重定向到登录页
    res.redirect('/login')
})

module.exports = router

