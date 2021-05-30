const {appID,appsecret} =require('../config')
//只需引入request-promise-native
const rp=require('request-promise-native')
const {writeFile,readFile}=require('fs')
/* 
获取acessToken
是什么？微信调用接口的全局唯一凭据

特点：
1.唯一的
2.有效期2小时
3.请求地址：https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
请求方式：get

设计思路：
1.首次本地没有，发送请求获取access_token(getAccessToken),保存下来（本地文件）(saveAccessToken)
2.第二次或以后
  -先去本地读取文件（readAccessToken），判断是否过期（isValidAccessToken）
    -过期了
      -重新请求获取acces_token(getAccessToken),保存下来覆盖之前的文件（保证文件是唯一的）
    -没有过期
*/
//定义类,获取access_token
class Wechat{
  constructor(){

  }
  /* 
    获取accessToken
  */
  getAccessToken(){
    const url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`
    //发送请求
    /* 
      request
      request-promise-native 返回值是一个promise对象
    */
   new Promise((resolve,reject)=>{
    rp({method:"get",url,json:true}).then((res=>{
        /* 
          { 
            access_token:'45_DPLdIGNNX9V_gZeNEZaVBP1qkDunyo_XvOJROIETJZzEr9oK1poqseHGvuaXz_O4buUGOoS03QkJDXhsSMKIXdk1x5lkumvDPC9pKxTXkFzwA9RO6cPaboiHAMVtPX_pBBmL1i7p5Usgp1jgDENiAAARSB',
            expires_in: 7200 
          } 
        */
        //设置过期时间
        res.expires_in=Date.now()+(res.expires_in-300)*1000
        //将promise对象状态改成成功状态
        resolve(res)

      })).catch(err=>{
        reject('getAccessToken方法出现问题',+err)
      })
   })
    
  }
  /* 
    用来保存access_token

  */
  saveAccessToken(accessToken){
    writeFile('./accessToken.txt')
  }
}


//模拟测试
const w=new Wechat()
w.getAccessToken()