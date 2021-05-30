/* 
  验证服务器有效性的模块

*/
const sha1=require('sha1')
const config =require('../config')
module.exports=()=>{
  return (req,res,next)=>{

    const {signature,echostr,timestamp,nonce}=req.query
    const {token}=config
  
    //1.将参与微信签名的三个参数组合在一起(timestamp,nonce,token)，按照字典序排序并组合在一起形成数组
    const arr=[timestamp,nonce,token]
  
    //2.将数组里所有参数拼接成一个字符串进行sha1加密
  
    const str=arr.sort().join('')
    const sha1Str=sha1(str)
  
    //3.加密完成后就生成一个signature和微信发送过来的进行对比
    if(sha1Str===signature){
      res.send(echostr)
    }else{
      res.end('error')
    }
  
  
    /* 
      { 
        signature: '1d6e7516264f3838ab16add08cd80e97b6786877',//微信加密签名
        echostr: '4417103270006992829',//微信的随机字符串
        timestamp: '1622346629',//微信发送请求时间戳
        nonce: '349876461'//微信的随机数字
      }
    */
  
  
  }
}