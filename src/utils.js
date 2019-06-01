import md5 from 'md5'
//添加localStorage
const LocalStorage={
  getItem(key,exp=Number.MAX_VALUE) {
    if (!key) return;
    var data = window.localStorage.getItem(key);
    var dataObj,dataObjDatatoJson;
    if(data){
      dataObj = JSON.parse(data)
      if (new Date().getTime() - dataObj.time>exp) {
        let dataObjDatatoJson='timeOut'
        return dataObjDatatoJson;
      }else{
        dataObjDatatoJson = dataObj.data
        return dataObjDatatoJson;
      }
    }else{
      return false;
    }
  },
  setItem(key, value) {
    if (!key) return;
    var curTime = new Date().getTime();
    value = JSON.stringify({data:value,time:curTime});
    window.localStorage.setItem(key, value);
  },
  removeItem(key) {
    if (!key) return;
    window.localStorage.removeItem(key);
  }
}
const dealUserInfo=(info)=>{
  info.accountInfo.amount=(new Date(info.accountInfo.deadline).getTime()>new Date().getTime())?info.accountInfo.amount:0
  let userInfo={
    id:info.id.toString(),
    name:info.nickname,
    account:info.account,
    avatar:info.avatar?(info.avatar.indexOf('http')!=-1?info.avatar:process.env.VUE_APP_IMG_URL+info.avatar+'!/both/200x200'):process.env.VUE_APP_IMG_URL+'/img/avatar_default.jpg',
  }
  LocalStorage.setItem('USER_INFO',userInfo)
  return userInfo
}

const upyunSignature=()=>{
  let policy=window.btoa(JSON.stringify({
    'bucket': 'fune-static',
    'save-key': '/{year}/{mon}/{day}/{hour}{min}{sec}{filemd5}{.suffix}',
    'expiration': Math.floor(new Date().getTime() / 1000) + 86400
  }))
  let signature=md5(policy+'&f9Qo0bynvsI9qW7a6Or95oT7zYc=')
  return {
    policy:policy,
    signature:signature
  }
}
const listToTree=(data)=>{
  data.map(item=>{
    item.value=item.id.toString()
    item.label=item.name
    item.title=item.name
    item.expand=true
    item.children=listToTree(item.children)
  })
  return data
}
const findParent=(data,id,indexArray)=>{
  let arr = Array.from(indexArray)
  for (let i = 0, len = data.length; i < len; i++) {
    arr.push(data[i].id.toString())
    if (data[i].id.toString() === id) {
      return arr
    }
    let children = data[i].children
    if (children && children.length) {
      let result = findParent(children, id, arr)
      if (result) return result
    }
    arr.pop()
  }
  return false

}
const discountCaculate=(a,b)=>{
  let value=a/b
  switch(true){
    case value<=0.25:
      return 0.3
    case value<=0.29:
      return 0.35
    case value<=0.33:
      return 0.4
    case value<=0.375:
      return 0.45
    case value<=0.4:
      return 0.48
    default: return 1
  }
}
const randomString=(len)=>{
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

const signature = (token, data) => {
  // 签名格式： timestamp + token + data(字典升序)
  let ret = [];
  for (let it in data) {
    let val = data[it];
    if (typeof val === 'object' && //
      (!(val instanceof Array) || (val.length > 0 && (typeof val[0] === 'object')))) {
      val = JSON.stringify(val);
    }
    ret.push(it + val);
  }
  // 字典升序
  ret.sort();
  let signstr = token + ret.join('');
  return md5(signstr);
}
export {LocalStorage,dealUserInfo,upyunSignature,listToTree,discountCaculate,randomString,findParent,signature}
