[CN](README.md) / [EN](README_EN.md)

## mini-vue  [![github](https://img.shields.io/badge/%E5%82%AC%E5%AD%A6%E7%A4%BE-mini--vue-blue)](https://github.com/cuixiaorui/mini-vue)

实现最简 vue3 模型，用于深入学习 vue3， 让你更轻松的理解 vue3 的核心逻辑

## Usage

[B 站](https://www.bilibili.com/video/BV1Zy4y1J73E) 提供了视频讲解使用方式

## Why

当我们需要深入学习 vue3 时，我们就需要看源码来学习，但是像这种工业级别的库，源码中有很多逻辑是用于处理边缘情况或者是兼容处理逻辑，是不利于我们学习的。

我们应该关注于核心逻辑，而这个库的目的就是把 vue3 源码中最核心的逻辑剥离出来，只留下核心逻辑，以供大家学习。

## How

基于 vue3 的功能点，一点一点的拆分出来。

代码命名会保持和源码中的一致，方便大家通过命名去源码中查找逻辑。

### Tasking

#### runtime-core

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
- [x] 支持 $el api
- [x] 支持 watchEffect


#### reactivity

目标是用自己的 reactivity 支持现有的 demo 运行

- [x] reactive 的实现
- [x] ref 的实现
- [x] readonly 的实现
- [x] computed 的实现
- [x] track 依赖收集
- [x] trigger 触发依赖
- [x] 支持 isReactive
- [x] 支持嵌套 reactive
- [x] 支持 toRaw
- [x] 支持 effect.scheduler
- [x] 支持 effect.stop
- [x] 支持 isReadonly
- [x] 支持 isProxy
- [x] 支持 shallowReadonly
- [x] 支持 proxyRefs

### compiler-core
- [x] 解析插值
- [x] 解析 element
- [x] 解析 text

### runtime-dom
- [x] 支持 custom renderer 

### runtime-test
- [x] 支持测试 runtime-core 的逻辑

### infrastructure
- [x] support monorepo with pnpm
### build

```shell
pnpm build
```

### example

通过 server 的方式打开 packages/vue/example/\* 下的 index.html 即可

>  推荐使用 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### 初始化

#### 流程图
![初始化流程图](https://user-images.githubusercontent.com/12064746/138114565-3e0eecbb-7fd0-4203-bf36-5e5fd8003ce0.png)

> 可加 vx：cuixr1314  获取所有脑图(备注：github mini-vue 领取脑图)
#### 关键函数调用图


![关键函数调用图2](https://images-1252602850.cos.ap-beijing.myqcloud.com/20220927170658.png)

> 可以基于函数名快速搜索到源码内容

### update

#### 流程图

![image](https://user-images.githubusercontent.com/12064746/138115157-1f4fb8a2-7e60-412d-96de-12e68eb0288c.png)

#### 关键函数调用图

![image](https://user-images.githubusercontent.com/12064746/138114969-9139e4af-b2df-41b2-a5d9-069d8b41903c.png)


> 可以基于函数名快速搜索到源码内容



### 从零到一实现一遍

自从有了 mini-vue 之后 很多同学都问我 能不能带着他从零到一敲一遍

因为对于源码的学习来讲 看在多遍也不如自己写一遍

为此我把 mini-vue 做成了一套视频课  从零到一带着大家实现一遍 不跳过任何一行代码

当然除了功能上的实现还有编程思想融入到了课程内 

比如 TDD、小步走、重构手法、TPP 

> TDD 测试驱动开发 影响了我整个技术生涯 可以说在我认识到 TDD 之后 技术才有了质的飞跃 

课程目录如下:

1. vue3 源码结构的介绍
2. reactivity 的核心流程
3. runtime-core 初始化的核心流程
4. runtime-core 更新的核心流程
5. setup 环境 -> 集成 jest 做单元测试 & 集成 typescript
6. 实现 effect 返回 runner
7. 实现 effect 的 scheduler 功能
8. 实现 effect 的 stop 功能
9. 实现 readonly 功能
10. 实现 isReactive 和 isReadonly 
11. 优化 stop 功能
12. 实现 reactive 和 readonly 嵌套对象转换功能
13. 实现 shallowReadonly 功能
14. 实现 isProxy 功能
15. 实现 isProxy 功能
16. 实现 ref 功能
17. 实现 isRef 和 unRef 功能
18. 实现 proxyR 功能
19. 实现 computed 计算属性功能
20. 实现初始化 component 主流程
21. 实现 rollup 打包
22. 实现初始化 element 主流程
23. 实现组件代理对象
24. 实现 shapeFlags
25. 实现注册事件功能
26. 实现组件 props 功能
27. 实现组件 emit 功能
28. 实现组件 slots 功能
29. 实现 Fragment 和 Text 类型节点
30. 实现 getCurrentInstance 
31. 实现依赖注入功能 provide/inject
32. 实现自定义渲染器 custom renderer
33. 更新 element 流程搭建
34. 更新 element 的props
35. 更新 element 的 children
36. 双端对比 diff 算法1
37. 双端对比 diff 算法2 - key 的作用
38. 双端对比 diff 算法3 - 最长子序列的作用
39. 学习尤大解决 bug 的处理方式
40. 实现组件更新功能
41. 实现 nextTick 功能
42. 编译模块概述
43. 实现解析插值功能
44. 实现解析 element 标签
45. 实现解析 text 功能
46. 实现解析三种联合类型 template
47. parse 的实现原理&有限状态机
48. 实现 transform 功能
49. 实现代码生成 string 类型
50. 实现代码生成插值类型
51. 实现代码生成三种联合类型
52. 实现编译 template 成 render 函数
53. 实现 monorepo & 使用 vitest 替换 jest 

课程内部包含了 vue3 的三大核心模块：reactivity、runtime 以及 compiler 模块

等你自己手写一遍之后 在去看 vue3 源码或者再去看分析解析 vue3 源码的书籍时你会有不同的体验

除此之外 还录制了课程介绍以及课程试听课
- [课程介绍](https://www.bilibili.com/video/BV16Z4y1r7Wp)
- [试听课](https://www.bilibili.com/video/BV1R341177P7)
- [购买链接](https://cua.h5.xeknow.com/s/xDWLc)

> 可以直接购买 也可以加我 wx: cuixr1314 来咨询这门课是否合适你

除了课程内容以外 还有专门的社群来答疑大家在学习上的问题 😊   
