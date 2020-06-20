// 第一版只支持 type 为 string
function createVNode(type:string, props, children) {
  const vnode = {
    type,
    el: null,
    props,
    children,
  };

  return vnode;
}

export const h = createVNode 
