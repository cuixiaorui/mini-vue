import { mutableHandlers } from "./baseHandlers";
export function reactive(target) {
  return createReactiveObject(target);
}

function createReactiveObject(target) {
  // 核心就是 proxy
  // 目的是可以侦听到用户 get 或者 set 的动作
  const proxy = new Proxy(target, mutableHandlers);

  return proxy;
}
