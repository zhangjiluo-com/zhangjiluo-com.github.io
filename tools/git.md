# Git

git 安装完以后, 需要在命令行进行一些基本设置

```shell
# 设置仓库提交代码的用户名
git config --global user.name=zhangjiluo.com
# 设置仓库提交代码的用户邮箱地址
git config --global user.email=zhangjiluo@zhangjiluo.com
# 提交代码时转换行尾符为LF，检出时不转换
git config --global core.autocrlf input
# 提交包含混合换行符的文件时给出警告
git config --global core.safecrlf warn
# 设置默认分支名为 main
git config --global init.defaultBranch main
# 设置禁止忽略大写写
git config --global core.ignorecase false
```
