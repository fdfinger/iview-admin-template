[toc]

# 开发工具
vscode

# 开发安装
`npm install` or `cnpm install`

# 测试环境
`npm run serve` 也可以自己调整 pakeage.json中scripts中的key

# 打包
`npm run build`

# 部署
nginx
``` conf
location / {
  root 文件目录
  try_files uri uri/ /index.html;//加上这句
}
```
