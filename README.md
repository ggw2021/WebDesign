# WebDesign
> 大二网页设计选修课作业<br>
###### 采用前后端分离技术： 
+ 前端:H5 + C3 + jquery 
+ 后端:mysql + node.js


### 文件结构总览

```
root
  │
  ├─app_server            # 服务器端
  │  ├─db                 # 数据库
  │  │      index.js
  │  │
  │  ├─node_modules       # 不用看
  │  │
  │  ├─router             # 路由
  │  │      artcate.js
  │  │      user.js
  │  │      userinfo.js
  │  │
  │  ├─router_handler     # 路由回调函数
  │  │      artcate.js
  │  │      user.js
  │  │      userinfo.js
  │  │
  │  └─schema             # 全局配置
  │          config.js
  │          user.js
  │
  └─web_client            # 客户端
      │  bookDescription.html
      │  bookStore.html
      │  borrow_records.html
      │  change.html
      │  index.html
      │  login.html
      │  message.html
      │  myStore.html
      │  my_pic.html
      │  nickname.html
      │  register.html
      │  search.html
      │
      ├─css                # css代码
      │      base.css
      │      bookDescription.css
      │      bookStore.css
      │      borrow_records.css
      │      change.css
      │      common.css
      │      cursor.css
      │      imageflow.css
      │      index.css
      │      login.css
      │      message.css
      │      myStore.css
      │      my_pic.css
      │      nickname.css
      │      register.css
      │      search.css
      │      style.css
      │
      ├─fonts              # 字体图标
      │      icomoon.eot
      │      icomoon.svg
      │      icomoon.ttf
      │      icomoon.woff
      │
      ├─images             # 图片
      │      favicon_fox.ico
      │      login.png
      │      logo.png
      │      rank.png
      │
      ├─js                 # js代码
      │      bookDescription.js
      │      bookStore.js
      │      borrow_records.js
      │      change.js
      │      common.js
      │      cursor.js
      │      imageflow.js
      │      index.js
      │      jquery.firefly-0.7.min.js
      │      jquery_min.js
      │      login.js
      │      message.js
      │      myStore.js
      │      my_pic.js
      │      nickname.js
      │      register.js
      │      search.js
      │
      └─upload            # 图片
              login1.jpg
```
