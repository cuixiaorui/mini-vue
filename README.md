## mini-vue

实现最简 vue3 模型，用于深入学习 vue3

## Usage

[B 站](https://www.bilibili.com/video/BV1Zy4y1J73E) 提供了视频讲解使用方式

## 探讨

可以入群一起探讨 vue3 源码

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/81624eaff67c41d69570dcc9ee9a6aec~tplv-k3u1fbpfcp-watermark.image)

如果这个项目帮助到你的话，可以增加一下我更新的动力

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0368e5a3c3e94d949c380fa7f744f54f~tplv-k3u1fbpfcp-watermark.image)

## 服务

提供一对一视频教学服务，手把手带你一起看 mini-vue 源码

> 可加群沟通

## Why

当我们需要深入学习 vue3 时，我们就需要看源码来学习，但是像这种工业级别的库，源码中有很多逻辑是用于处理边缘情况或者是兼容处理逻辑，是不利于我们学习的。

我们应该关注于核心逻辑，而这个库的目的就是把 vue3 源码中最核心的逻辑剥离出来，只留下核心逻辑，以供大家学习。

## How

基于 vue3 的功能点，一点一点的拆分出来。

代码命名会保持和源码中的一致，方便大家通过命名去源码中查找逻辑。

### Tasking

- [x] 支持组件类型
- [x] 支持 element 类型
- [x] 初始化 props
- [x] setup 可获取 props 和 context
- [x] 支持 component emit
- [x] 支持 proxy
- [x] 可以在 render 函数中获取 setup 返回的对象
- [x] nextTick 的实现
- [x] 支持 getCurrentInstance
- [x] 支持 provide/inject
- [x] 支持最基础的 slots
- [x] 支持 Text 类型节点

### roadmap

- [ ] 支持英文
- [ ] 规范化 console.log

### build

```shell
yarn build
```

### example

通过 server 的方式打开 example/\* 下的 index.html 即可

>  推荐使用 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### 初始化

#### 流程图

![初始化流程图](https://user-gold-cdn.xitu.io/2020/7/6/1732311ea8a9142a?w=1724&h=762&f=png&s=493353)

#### 关键函数调用图

![关键函数调用图1](https://user-gold-cdn.xitu.io/2020/6/22/172dc07fc42b7d2c?w=1342&h=144&f=png&s=54200)

![关键函数调用图2](https://user-gold-cdn.xitu.io/2020/6/22/172dc08840e25b42?w=1816&h=934&f=png&s=550722)

> 可以基于函数名快速搜索到源码内容

### update

#### 流程图

![update流程图](https://user-gold-cdn.xitu.io/2020/6/23/172e19b5cefba34e?w=3200&h=800&f=png&s=540515)

#### 关键函数调用图

![update关键函数调用图](https://user-gold-cdn.xitu.io/2020/6/23/172e19d2d42464aa?w=3300&h=1006&f=png&s=739008)

> 可以基于函数名快速搜索到源码内容
