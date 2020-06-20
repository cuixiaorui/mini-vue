## mini-vue
实现最简 vue3 模型，用于学习



### build
```shell
yarn build
```

### example
直接打开 example/index.html 即可



### tasking
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
