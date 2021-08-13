import { mutableHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export function reactive(target) {
  return createReactiveObject(target);
}

export function isReactive(value) {
  // 如果 value 是 proxy 的话
  // 会触发 get 操作，而在 createGetter 里面会判断
  // 如果 value 是普通对象的话
  // 那么会返回 undefined ，那么就需要转换成布尔值
  return !!value[ReactiveFlags.IS_REACTIVE];
}

function createReactiveObject(target) {
  // 核心就是 proxy
  // 目的是可以侦听到用户 get 或者 set 的动作
  const proxy = new Proxy(target, mutableHandlers);

  return proxy;
}
