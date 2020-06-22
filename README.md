## mini-vue
实现最简 vue3 模型，用于学习



### build
```shell
yarn build
```

### example
直接打开 example/index.html 即可

### 初始化

#### 流程图
![初始化流程图](https://user-gold-cdn.xitu.io/2020/6/22/172dc0534a98092a?w=1796&h=802&f=png&s=537069)

#### 关键函数调用图
![关键函数调用图1](https://user-gold-cdn.xitu.io/2020/6/22/172dc07fc42b7d2c?w=1342&h=144&f=png&s=54200)

![关键函数调用图2](https://user-gold-cdn.xitu.io/2020/6/22/172dc08840e25b42?w=1816&h=934&f=png&s=550722)

> 可以基于函数名快速搜索到源码内容

#### tasking
- [ ] runtime-core 初始化逻辑
    - [ ] 基础类型的处理：static fragment comment
    - [ ] 触发各种 hook
    - [ ] 标准化 vnode 的实现
    - [ ] 初始化 props 逻辑
    - [ ] 初始化 slots 逻辑
    - [ ] proxy 暴露给用户的代理实现
    - [ ] 支持 template 
    - [ ] 给元素设置 props
        - [ ] 需要过滤掉vue自身用的key
