import { ReactiveEffect, track, trigger } from "./effect";
import { reactive, ReactiveFlags, reactiveMap } from "./reactive";
import { isObject } from "../../shared/index";

const get = createGetter();
const set = createSetter();

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const isExistInReactiveMap = () =>
      key === ReactiveFlags.RAW && receiver === reactiveMap.get(target);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    } else if (isExistInReactiveMap()) {
      return target;
    }

    const res = Reflect.get(target, key, receiver);

    if (isObject(res)) {
      // 把内部所有的是 object 的值都用 reactive 包裹，变成响应式对象
      // 如果说这个 res 值是一个对象的话，那么我们需要把获取到的 res 也转换成 reactive
      // res 等于 target[key]
      return reactive(res);
    }

    // 在触发 get 的时候进行依赖收集
    track(target, "get", key);
    return res;
  };
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);

    // 在触发 set 的时候进行触发依赖
    trigger(target, "get", key);

    return result;
  };
}

export const mutableHandlers = {
  get,
  set,
};
