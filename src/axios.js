import axios from 'axios'
import qs from 'qs'
import $cookies from 'vue-cookies'
import { Modal, Message } from 'iview'
import JSONB from 'json-bigint'
import {signature} from './utils'

var instance = axios.create({
  baseURL:process.env.VUE_APP_API_URL,
});

instance.interceptors.request.use(function(config){
  let authToken = $cookies.get('AUTH_TOKEN')
  let url = config.url;
  if(url.indexOf("login") > -1 || url.indexOf('oauth') > -1 ) config.headers.accessToken = "";
  //在请求参数中加入签名
  if (config.method=='post' && (config[0] == undefined || config[0].toLowerCase() != 'json')){
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.transformRequest=[function (data) {
      data.timestamp=new Date().getTime()
      let signstr=signature(authToken,data)
      data.signature=signstr
      return qs.stringify(data, { arrayFormat: 'repeat' } );
    }]
  }
  if (config.method=='get'){
    var data=qs.parse(config.data)
    data.timestamp=new Date().getTime()
    let signstr=signature(authToken,data)
    data.signature=signstr
    config.url=config.url+'?'+qs.stringify(data, { arrayFormat: 'repeat' } )
  }
  if (authToken) config.headers.accessToken = authToken
  return config;
},function(err){
  return Promise.reject(err);
});

instance.interceptors.response.use(function(res){
  if(res.data.code===-401&&res.config.url.includes('user/login')==false){
    let token=$cookies.get('AUTH_TOKEN')
    Modal.error({
      title: '系统提示',
      content: token?'您的登录信息已过期，请重新登录':'您还未登录账号，请先登录',
      onOk() {
        window.vm.$router.replace('/login?referer='+encodeURIComponent(window.vm.$route.fullPath))
      }
    })
  }else if (res.data.code!=1){
    Message.error(res.data.msg)
  }
  if (res.request.response){
    return JSONB.parse(res.request.response);
  }else{
    return res.data
  }
}, function(error){
  Message.error(error.message)
  return false
});
export default instance;
