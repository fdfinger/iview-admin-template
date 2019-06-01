export let formatCurrency = (num) => {
  var j = 0
  var negative = num < 0 ? '-' : ''
  var i = parseInt(num = Math.abs(+num || 0).toFixed(2), 10) + ''
  j = (j = i.length) > 3 ? j % 3 : 0
  return negative + (j ? i.substr(0, j) + ',' : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + ',') + '.' + Math.abs(num - i).toFixed(2).slice(2)
}

export let formatStandard= (data) =>{
  if (typeof(data)=='string') return data
  if (typeof(data)!='object') data=JSON.parse(data)
  var str=''
  data.map(item=>{
    str+=' '+item.value+' '
  })
  return str
}

export let freightInfo=(data)=>{
  if (!data) data='0:0'
  if (!data.includes(':')) data=data+':0'
  var freightArray=data.split(':')
  if (freightArray[0]==0&&freightArray[1]==0){
    return '包邮'
  }else if (freightArray[1]==0){
    return freightArray[0]+'元'
  }else{
    return freightArray[0]+'元首件，后续每件'+freightArray[1]+'元'
  }
}
export let freightCaculate=(data,quantity)=>{
  if (!data) data='0:0'
  if (!data.includes(':')) data=data+':0'
  var freightArray=data.split(':')
  return Number(freightArray[0])+(Number(freightArray[1])*(quantity-1))
}

export let formatLeaveTime=(time)=>{
  //time 为秒
  let days = time/86400;
  // 下面都是简单的数学计算
  let day = Math.floor(days);
  let hours = (days - day)*24;
  let hour = Math.floor(hours);
  let minutes = (hours - hour)*60;
  let minute = Math.floor(minutes);
  let seconds = (minutes - minute)*60;
  let second = Math.floor(seconds);
  return (day>0?day+'天':'')+(hour>0?hour+'时':'')+(minute>0?minute+'分':'')+(second>0?second+'秒':'')
}

export let securityMobile = (str) => {
  return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export let device = (device) => {
  switch (device) {
    case 'APPANDROID':
      return '安卓APP'
    case 'APPIOS':
      return '苹果APP'
    case 'XCX':
      return '小程序'
    case 'MOBILE':
      return 'WAP端'
    case 'WAP':
      return 'WAP端'
    case 'PC':
      return 'PC端'
  }
}
