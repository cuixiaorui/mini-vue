## mini-vue
实现最简 vue3 模型，用于学习

### 学习思路
先整理出整个 vue3 的 happy path 来，这相当于是一个房子的框架，然后在慢慢的整理实现细节

### todo
- [ ] runtime-core
    - 初始化 
        - [x] 流程
        - [ ] 细节实现
            - [ ] hook 的触发实现
            - [ ] 标准化 vnode 的实现
            - [ ] 初始化 props 逻辑
            - [ ] 初始化 slots 逻辑
            - [ ] proxy 暴露给用户的代理实现
            - [ ] 给元素设置 props
    - 更新
        - [x] 流程
        - [x] nextTick 的实现
        - [ ] 细节实现
            - [x] text_children 类型的 patch
            - [x] array_children 类型的 patch
            - [x] props 类型的 patch



### build
```shell
yarn build
```

### example
直接打开 example/index.html 即可

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

