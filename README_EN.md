[EN](README.md) / [CN](README.md)
## mini-vue

Implement the simplest vue3 model for in-depth study of vue3 source code

## Usage

[Bilibili](https://www.bilibili.com/video/BV1Zy4y1J73E) Provides a video explaining how to use it

> Can follow my [Bilibili](https://space.bilibili.com/175301983)，Interpretation of live source code from time to time

## Discuss

You can join the group to discuss the vue3 source code


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbe1b6e9c67944828c3e653fd7919dc0~tplv-k3u1fbpfcp-watermark.image)

> with WeChat

## Service

Provide one-to-one video teaching services, and take you to see the mini-vue source code hand in hand

> Can add group communication

## Why

When we need to learn vue3 in depth, we need to look at the source code to learn, but like this kind of industrial-level library, there are a lot of logic in the source code for processing edge cases or compatible processing logic, which is not conducive to our learning.

We should focus on the core logic, and the purpose of this library is to separate the core logic from the vue3 source code, leaving only the core logic for everyone to learn.

## How

Based on the function points of vue3, split it out bit by bit

The code naming will remain consistent with the source code, so that you can find logic in the source code through naming.

### Tasking

- [x] support component type
- [x] support element type
- [x] init props of component
- [x] context can get props and context in setup
- [x] support component emit
- [x] support proxy
- [x] can get the object returned by setup in the render function
- [x] Implementation of nextTick
- [x] support getCurrentInstance
- [x] support provide/inject
- [x] support basic slots
- [x] support text type 

### roadmap

- [ ] support english
- [ ] normalize console.log

### build

```shell
yarn build
```

### example

Open index.html under example/\* use server

>  Recommended Use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### Initialization

#### flow chart

![初始化流程图](https://user-images.githubusercontent.com/12064746/138114565-3e0eecbb-7fd0-4203-bf36-5e5fd8003ce0.png)

#### Key function call graph

![关键函数调用图1](https://user-gold-cdn.xitu.io/2020/6/22/172dc07fc42b7d2c?w=1342&h=144&f=png&s=54200)

![关键函数调用图2](https://user-gold-cdn.xitu.io/2020/6/22/172dc08840e25b42?w=1816&h=934&f=png&s=550722)

> The source code content can be quickly searched based on the function name

### update

#### flow chart

![update流程图](https://user-images.githubusercontent.com/12064746/138115157-1f4fb8a2-7e60-412d-96de-12e68eb0288c.png)

#### Key function call graph

![update关键函数调用图](https://user-images.githubusercontent.com/12064746/138114969-9139e4af-b2df-41b2-a5d9-069d8b41903c.png)

> The source code content can be quickly searched based on the function name
