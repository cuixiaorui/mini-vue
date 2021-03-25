import { createVNode } from "./vnode";
export const h = (type: string, props: any, children: string | Array<any>) => {
  return createVNode(type, props, children);
};
