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
   return new Promise((resolve,reject)=>{
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
    //将对象转成json字符串
    accessToken=JSON.stringify(accessToken)
    return new Promise((resolve,reject)=>{
      writeFile('./accessToken.txt',accessToken,err=>{
        if(!err){
          console.log('文件保存成功')
          resolve()
        }else{
          reject('saveAccessToken报错'+err)
        }
      })
    })
    
  }

  readAccessToken(){
    //读取本地文件中的access_token
    return new Promise((resolve,reject)=>{
      readFile('./accessToken.txt',(err,data)=>{
        if(!err){
          resolve(JSON.parse(data))
        }else{
          reject('readAccessToken报错'+err)
        }
      })
    })
  }

  isValidAccessToken(data){
    //判断access_token是否有效
    //检测传入参数是否有效
    if(!data && data.access_token && !data.expires_in){
      return false
    }
    return data.expires_in>Date.now()
  }
  /* 
    获取没有过期的accessToken
  */
  fetchAccessToken(){
    if(this.access_token &&this.expires_in &&this.isValidAccessToken(this)){
      //说明之前保存过access_token 并且是有效的，直接使用
      return Promise.resolve({
        access_token:this.access_token,
        expires_in:this.expires_in
      })
    }
    
    return this.readAccessToken().then(async res=>{
        //本地有文件
        if(this.isValidAccessToken(res)){
          return Promise.resolve(res)
        }else{
          const res=await this.getAccessToken()
          await this.saveAccessToken(res)
          return Promise.resolve(res)
        }
      }).catch(async err=>{
        //本地没有文件
        const res=await this.getAccessToken()
        await this.saveAccessToken(res)
        return Promise.resolve(res)
      }).then(res=>{
        this.access_token=res.access_token
        this.expires_in=res.expires_in
        //是this.readAccessToken最终的返回值
        return Promise.resolve(res)
      })

  }
}


//模拟测试
const w=new Wechat()
w.fetchAccessToken()

