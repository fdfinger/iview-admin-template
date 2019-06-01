const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
  },
  productionSourceMap: false,
  devServer: {
    //proxy: 'https://mana.fune.store/back/'
    proxy: 'http://192.168.0.143:8001/back'
    // proxy: 'http://192.168.5.20:8001/back'
  }
}
