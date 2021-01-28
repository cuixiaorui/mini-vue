import { initProps } from "./componentProps";
export function createComponentInstance(vnode) {
  const instance = {
    type: vnode.type,
    vnode,
    props: {},
    proxy: null,
    isMounted: false,
  };

  return instance;
}

export function setupComponent(instance) {
  // 1. 处理 props
  // 取出存在 vnode 里面的 props
  const { props } = instance.vnode;
  initProps(instance, props);
  // 2. 处理 slots
  initSlots();

  // 源码里面有两种类型的 component
  // 一种是基于 options 创建的
  // 还有一种是 function 的
  // 这里处理的是 options 创建的
  // 叫做 stateful 类型
  setupStatefulComponent(instance);
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

  // 调用 setup 的时候传入 props
  // TODO 还需要传入 setupContext
  const setupContext = createSetupContext();
  const setupResult =
    instance.setup && instance.setup(instance.props, setupContext);

  // 3. 处理 setupResult
  handleSetupResult(instance, setupResult);
}

function createSetupContext() {
  // TODO
  // 需要实现 emit
  // slots
  console.log("初始化 setup context");
  return {};
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
