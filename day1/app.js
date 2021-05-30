const express = require('express')
const auth=require('./wechat/auth')

const app=express()

  /* 
  1.
  微信服务器知道开发者是哪个
  测试号管理页面上填写url开发者服务器地址
  使用ngrok 内网穿透 将本地端口号开启的服务器映射外网跨域访问一个网址
  
  填写token
  参与微信签名加密的一个参数


  2.开发者服务器 验证消息是否来自微信服务器
    目的：计算得出signature微信加密签名，和微信传递过来的signature进行对比，如果一样，说明消息来自微信服务器，如果不一样说明不是微信服务发送的消息
    1.将参与微信签名的三个参数组合在一起(timestamp,nonce,token)，按照字典序排序并组合在一起形成数组
    2.将数组里所有参数拼接成一个字符串进行sha1加密
    3.加密完成后就生成一个signature和微信发送过来的进行对比
    如果一样说明消息来自微信服务器，返回echart给微信服务器，
    如果不一样，返回error

  
  */
 //接受处理所有消息
 //定制配置对象
app.use(
  auth()
)

app.listen(3000,()=>{
  console.log('服务器启动成功')
})