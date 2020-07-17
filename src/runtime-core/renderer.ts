import { ShapeFlags } from "../shared";
import { createComponentInstance } from "./component";
import {
  hostCreateElement,
  hostSetElementText,
  hostPatchProp,
  hostInsert,
  hostRemove,
} from "./render-api";
import { queueJob } from "./scheduler";
import { effect } from "@vue/reactivity";
import { h } from "./h";

export const render = (vnode, container) => {
  console.log("调用 patch");
  patch(null, vnode, container);
};

function patch(n1, n2, container = null) {
  // 基于 n2 的类型来判断
  // 因为 n2 是新的 vnode
  const { type, shapeFlag } = n2;
  switch (type) {
    case "text":
      // todo
      break;
    // 其中还有几个类型比如： static fragment comment

    default:
      // 这里就基于 shapeFlag 来处理
      if (shapeFlag & ShapeFlags.ELEMENT) {
        console.log("处理 element");
        processElement(n1, n2, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        console.log("处理 component");
        processComponent(n1, n2, container);
      }
  }
}

function processElement(n1, n2, container) {
  if (!n1) {
    mountElement(n2, container);
  } else {
    // todo
    updateElement(n1, n2, container);
  }
}

function updateElement(n1, n2, container) {
  const oldProps = (n1 && n1.props) || {};
  const newProps = n2.props || {};
  // 应该更新 element
  console.log("应该更新 element");
  console.log("旧的 vnode", n1);
  console.log("新的 vnode", n2);

  // 需要把 el 挂载到新的 vnode
  const el = (n2.el = n1.el);

  // 对比 props
  patchProps(el, oldProps, newProps);

  // 对比 children
  patchChildren(n1, n2, el);
}

function patchProps(el, oldProps, newProps) {
  // 对比 props 有以下几种情况
  // 1. oldProps 有，newProps 也有，但是 val 值变更了
  // 举个栗子
  // 之前: oldProps.id = 1 ，更新后：newProps.id = 2

  // key 存在 oldProps 里 也存在 newProps 内
  // 以 newProps 作为基准
  for (const key in newProps) {
    const prevProp = oldProps[key];
    const nextProp = newProps[key];
    if (prevProp !== nextProp) {
      // 对比属性
      // 需要交给 host 来更新 key
      hostPatchProp(el, key, prevProp, nextProp);
    }
  }

  // 2. oldProps 有，而 newProps 没有了
  // 之前： {id:1,tId:2}  更新后： {id:1}
  // 这种情况下我们就应该以 oldProps 作为基准，因为在 newProps 里面是没有的 tId 的
  // 还需要注意一点，如果这个 key 在 newProps 里面已经存在了，说明已经处理过了，就不要在处理了
  for (const key in oldProps) {
    const prevProp = oldProps[key];
    const nextProp = null;
    if (!(key in newProps)) {
      // 这里是以 oldProps 为基准来遍历，
      // 而且得到的值是 newProps 内没有的
      // 所以交给 host 更新的时候，把新的值设置为 null
      hostPatchProp(el, key, prevProp, nextProp);
    }
  }
}

function patchChildren(n1, n2, container) {
  const { shapeFlag: prevShapeFlag, children: c1 } = n1;
  const { shapeFlag, children: c2 } = n2;

  // 如果 n2 的 children 是 text 类型的话
  // 就看看和之前的 n1 的 children 是不是一样的
  // 如果不一样的话直接重新设置一下 text 即可
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    if (c2 !== c1) {
      console.log("类型为 text_children, 当前需要更新");
      hostSetElementText(container, c2 as string);
    }
  } else {
    // 如果之前是 array_children
    // 现在还是 array_children 的话
    // 那么我们就需要对比两个 children 啦
    if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        patchKeyedChildren(c1, c2, container);
      }
    }
  }
}

function patchKeyedChildren(c1: any[], c2: any[], container) {
  let i = 0;
  let e1 = c1.length - 1;
  let e2 = c2.length - 1;

  const isSameVNodeType = (n1, n2) => {
    return n1.type === n2.type && n1.key === n2.key;
  };

  while (i <= e1 && i <= e2) {
    const prevChild = c1[i];
    const nextChild = c2[i];

    if (!isSameVNodeType(prevChild, nextChild)) {
      console.log("两个 child 不相等(从左往右比对)");
      console.log(`prevChild:${prevChild}`);
      console.log(`nextChild:${nextChild}`);
      break;
    }

    console.log("两个 child 相等，接下来对比着两个 child 节点(从左往右比对)");
    patch(prevChild, nextChild, container);
    i++;
  }

  while (i <= e1 && i <= e2) {
    // 从右向左取值
    const prevChild = c1[e1];
    const nextChild = c2[e2];

    if (!isSameVNodeType(prevChild, nextChild)) {
      console.log("两个 child 不相等(从右往左比对)");
      console.log(`prevChild:${prevChild}`);
      console.log(`nextChild:${nextChild}`);
      break;
    }
    console.log("两个 child 相等，接下来对比着两个 child 节点(从右往左比对)");
    patch(prevChild, nextChild, container);
    e1--;
    e2--;
  }

  if (i > e1 && i <= e2) {
    // 如果是这种情况的话就说明 e2 也就是新节点的数量大于旧节点的数量
    // 也就是说新增了 vnode
    // 应该循环 c2
    while (i <= e2) {
      console.log(`需要新创建一个 vnode: ${c2[i].key}`);
      patch(null, c2[i], container);
      i++;
    }
  } else if (i > e2 && i <= e1) {
    // 这种情况的话说明新节点的数量是小于旧节点的数量的
    // 那么我们就需要把多余的
    while (i <= e1) {
      console.log(`需要删除当前的 vnode: ${c1[i].key}`);
      hostRemove(c1[i].el);
      i++;
    }
  } else {
    // 左右两边都比对完了，然后剩下的就是中间部位顺序变动的
    // 例如下面的情况
    // a,b,[c,d,e],f,g
    // a,b,[e,c,d],f,g

    let s1 = i;
    let s2 = i;
    const keyToNewIndexMap = new Map();
    // 先把 key 和 newIndex 绑定好，方便后续基于 key 找到 newIndex
    for (let i = s2; i <= e2; i++) {
      const nextChild = c2[i];
      keyToNewIndexMap.set(nextChild.key, i);
    }

    // 需要处理新节点的数量
    const toBePatched = e2 - s2 + 1;
    const newIndexToOldIndexMap = new Array(toBePatched);
    for (let index = 0; index < newIndexToOldIndexMap.length; index++) {
      // 源码里面是用 0 来初始化的
      // 但是有可能 0 是个正常值
      // 我这里先用 -1 来初始化
      newIndexToOldIndexMap[index] = -1;
    }
    // 遍历老节点
    // 1. 需要找出老节点有，而新节点没有的 -> 需要把这个节点删除掉
    // 2. 新老节点都有的，—> 需要 patch
    for (i = s1; i <= e1; i++) {
      const prevChild = c1[i];
      const newIndex = keyToNewIndexMap.get(prevChild.key);
      newIndexToOldIndexMap[newIndex] = i;

      // 因为有可能 nexIndex 的值为0（0也是正常值）
      // 所以需要通过值是不是 undefined 来判断
      // 不能直接 if(newIndex) 来判断
      if (newIndex === undefined) {
        // 当前节点的key 不存在于 newChildren 中，需要把当前节点给删除掉
        hostRemove(prevChild.el);
      } else {
        // 新老节点都存在
        console.log("新老节点都存在");
        patch(prevChild, c2[newIndex], container);
      }
    }

    // 遍历新节点
    // 1. 需要找出老节点没有，而新节点有的 -> 需要把这个节点创建
    // 2. 最后需要移动一下位置，比如 [c,d,e] -> [e,c,d]
    for (i = e2; i >= s2; i--) {
      const nextChild = c2[i];

      if (newIndexToOldIndexMap[i] === -1) {
        // 说明是个新增的节点
        patch(null, c2[i], container);
      } else {
        // 有可能 i+1 没有元素 没有的话就直接设置为 null
        // 在 hostInsert 函数内如果发现是 null 的话，会直接添加到父级容器内
        const anchor = i + 1 >= e2 + 1 ? null : c2[i + 1];
        hostInsert(nextChild.el, container, anchor && anchor.el);
      }
    }
  }
}

function mountElement(vnode, container) {
  const { shapeFlag, props } = vnode;
  // 1. 先创建 element
  // 基于可扩展的渲染 api
  const el = (vnode.el = hostCreateElement(vnode.type));

  // 支持单子组件和多子组件的创建
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 举个栗子
    // render(){
    //     return h("div",{},"test")
    // }
    // 这里 children 就是 test ，只需要渲染一下就完事了
    console.log(`处理文本:${vnode.children}`);
    hostSetElementText(el, vnode.children);
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 举个栗子
    // render(){
    // Hello 是个 component
    //     return h("div",{},[h("p"),h(Hello)])
    // }
    // 这里 children 就是个数组了，就需要依次调用 patch 递归来处理
    mountChildren(vnode.children, el);
  }

  // 处理 props
  if (props) {
    for (const key in props) {
      // todo
      // 需要过滤掉vue自身用的key
      // 比如生命周期相关的 key: beforeMount、mounted
      const nextVal = props[key];
      hostPatchProp(el, key, null, nextVal);
    }
  }

  // todo
  // 触发 beforeMount() 钩子
  console.log("vnodeHook  -> onVnodeBeforeMount");
  console.log("DirectiveHook  -> beforeMount");
  console.log("transition  -> beforeEnter");

  // 插入
  hostInsert(el, container);

  // todo
  // 触发 mounted() 钩子
  console.log("vnodeHook  -> onVnodeMounted");
  console.log("DirectiveHook  -> mounted");
  console.log("transition  -> enter");
}

function mountChildren(children, container) {
  children.forEach((VNodeChild) => {
    // todo
    // 这里应该需要处理一下 vnodeChild
    // 因为有可能不是 vnode 类型
    console.log("mountChildren:", VNodeChild);
    patch(null, VNodeChild, container);
  });
}

function processComponent(n1, n2, container) {
  // 如果 n1 没有值的话，那么就是 mount
  if (!n1) {
    // 初始化 component
    mountComponent(n2, container);
  } else {
    // todo
    // updateComponent()
  }
}

function mountComponent(initialVNode, container) {
  // 1. 先创建一个 component instance
  const instance = (initialVNode.component = createComponentInstance(
    initialVNode
  ));
  console.log(`创建组件实例:${instance.type.name}`);
  // 2. 给 instance 加工加工
  setupComponent(instance);

  setupRenderEffect(instance, container);
}

function setupComponent(instance) {
  // 1. 处理 props
  initProps();
  // 2. 处理 slots
  initSlots();

  // 源码里面有两种类型的 component
  // 一种是基于 options 创建的
  // 还有一种是 function 的
  // 这里处理的是 options 创建的
  // 叫做 stateful 类型
  setupStatefulComponent(instance);
}

function initProps() {
  // todo
  console.log("initProps");
}

function initSlots() {
  // todo
  console.log("initSlots");
}

function setupStatefulComponent(instance) {
  // todo
  // 1. 先创建代理 proxy
  console.log("创建 proxy");
  // 2. 调用 setup
  // todo
  // 应该传入 props 和 setupContext
  const setupResult = instance.setup && instance.setup(instance.props);

  // 3. 处理 setupResult
  handleSetupResult(instance, setupResult);
}

function handleSetupResult(instance, setupResult) {
  // setup 返回值不一样的话，会有不同的处理
  // 1. 看看 setupResult 是个什么
  if (typeof setupResult === "function") {
    // 如果返回的是 function 的话，那么绑定到 render 上
    // 认为是 render 逻辑
    // setup(){ return ()=>(h("div")) }
    instance.render = setupResult;
  } else if (typeof setupResult === "object") {
    // 返回的是一个对象的话
    // 先存到 setupState 上
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  // 给 instance 设置 render

  // 先取到用户设置的 component options
  const Component = instance.type;

  if (!instance.render) {
    // todo
    // 调用 compile 模块来编译 template
    // Component.render = compile(Component.template, {
    //     isCustomElement: instance.appContext.config.isCustomElement || NO
    //   })
  }

  instance.render = Component.render;

  // applyOptions()
}

function applyOptions() {
  // 兼容 vue2.x
  // todo
}

function setupRenderEffect(instance, container) {
  // 调用 render
  // 应该传入 ctx 也就是 proxy
  // ctx 可以选择暴露给用户的 api
  // 源代码里面是调用的 renderComponentRoot 函数
  // 这里为了简化直接调用 render

  // obj.name  = "111"
  // obj.name = "2222"
  // 从哪里做一些事
  // 收集数据改变之后要做的事 (函数)
  // 依赖收集   effect 函数
  // 触发依赖
  instance.update = effect(
    function componentEffect() {
      if (!instance.isMounted) {
        // 组件初始化的时候会执行这里
        // 为什么要在这里调用 render 函数呢
        // 是因为在 effect 内调用 render 才能触发依赖收集
        // 等到后面响应式的值变更后会再次触发这个函数
        console.log("调用 render,获取 subTree");
        const subTree = (instance.subTree = instance.render(instance.proxy));
        console.log("subTree", subTree);

        // todo
        console.log(`${instance.type.name}:触发 beforeMount hook`);
        console.log(`${instance.type.name}:触发 onVnodeBeforeMount hook`);

        // 这里基于 subTree 再次调用 patch
        // 基于 render 返回的 vnode ，再次进行渲染
        // 这里我把这个行为隐喻成开箱
        // 一个组件就是一个箱子
        // 里面有可能是 element （也就是可以直接渲染的）
        // 也有可能还是 component
        // 这里就是递归的开箱
        // 而 subTree 就是当前的这个箱子（组件）装的东西
        // 箱子（组件）只是个概念，它实际是不需要渲染的
        // 要渲染的是箱子里面的 subTree
        patch(null, subTree, container);

        console.log(`${instance.type.name}:触发 mounted hook`);
        instance.isMounted = true;
      } else {
        // 响应式的值变更后会从这里执行逻辑
        // 主要就是拿到新的 vnode ，然后和之前的 vnode 进行对比
        console.log("调用更新逻辑");
        // 拿到最新的 subTree
        const nextTree = instance.render(instance.proxy);
        // 替换之前的 subTree
        const prevTree = instance.subTree;
        instance.subTree = nextTree;

        // 触发 beforeUpdated hook
        console.log("beforeUpdated hook");
        console.log("onVnodeBeforeUpdate hook");

        // 用旧的 vnode 和新的 vnode 交给 patch 来处理
        patch(prevTree, nextTree, prevTree.el);

        // 触发 updated hook
        console.log("updated hook");
        console.log("onVnodeUpdated hook");
      }
    },
    {
      scheduler: (effect) => {
        // 把 effect 推到微任务的时候在执行
        queueJob(effect)
      },
    }
  );
}
