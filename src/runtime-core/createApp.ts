import { render } from "./renderer";
import { createVNode } from "./createVNode";

// createApp
// 在 vue3 里面 createApp 是属于 renderer 对象的
// 而 renderer 对象需要创建
// 这里我们暂时不实现

export const createApp = (rootComponent) => {
  const app = {
    _component: rootComponent,
    _container: null,
    mount(rootContainer) {
      console.log("基于根组件创建 vnode");
      const vnode = createVNode(rootComponent);
      app._container = rootContainer;
      console.log("调用 render，基于 vnode 进行开箱");
      render(vnode, rootContainer);
    },
  };

  return app;
};
