import { trackEffects, triggerEffects, isTracking } from "./effect";
import { createDep } from "./dep";
import { isObject, hasChanged } from "../../shared";
import { reactive } from "./reactive";

export class RefImpl {
  private _rawValue: any;
  private _value: any;
  public dep;
  public __v_isRef = true;

  constructor(value) {
    //用户传的值
    this._rawValue = value;
    // 看看value 是不是一个对象，如果是一个对象的话
    // 那么需要用 reactive 包裹一下
    this._value = convert(value);

    this.dep = createDep();
    //  用于存储所有的 effect 对象
    // export function createDep(effects?) {
    //   const dep = new Set(effects);  //源码 const dep = new Set<ReactiveEffect>(effects) as Dep
    //   return dep;
    // }
  }

  get value() {
    // 收集依赖
    console.log("aa-this-收集依赖", this);
    trackRefValue(this);
    console.log("aa-ref-get");
    return this._value;
  }

  set value(newValue) {
    // 当新的值不等于老的值的话，
    // 那么才需要触发依赖
    console.log("aa-ref-set");
    if (hasChanged(newValue, this._rawValue)) {
      // 更新值
      this._value = convert(newValue); //看看value 是不是一个对象，如果是一个对象的话 那么需要用 reactive 包裹一下
      this._rawValue = newValue;
      // 触发依赖
      triggerRefValue(this);
    }
  }
}

export function ref(value) {
  return createRef(value);
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function createRef(value) {
  const refImpl = new RefImpl(value);

  return refImpl;
}

export function triggerRefValue(ref) {
  triggerEffects(ref.dep);
  // export function triggerEffects(dep) {
  //  执行收集到的所有的 effect 的 run 方法
  //   for (const effect of dep) {
  //     if (effect.scheduler) {
  // scheduler 可以让用户自己选择调用的时机
  // 这样就可以灵活的控制调用了
  // 在 runtime-core 中，就是使用了 scheduler 实现了在 next ticker 中调用的逻辑
  //       effect.scheduler();
  //     } else {
  //       effect.run();
  //     }
  //   }
  // }
}

export function trackRefValue(ref) {
  console.log(isTracking, isTracking(), "aa-isTracking");
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

// 这个函数的目的是
// 帮助解构 ref
// 比如在 template 中使用 ref 的时候，直接使用就可以了
// 例如： const count = ref(0) -> 在 template 中使用的话 可以直接 count
// 解决方案就是通过 proxy 来对 ref 做处理

const shallowUnwrapHandlers = {
  get(target, key, receiver) {
    // 如果里面是一个 ref 类型的话，那么就返回 .value
    // 如果不是的话，那么直接返回value 就可以了
    return unRef(Reflect.get(target, key, receiver));
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      return (target[key].value = value);
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  },
};

// 这里没有处理 objectWithRefs 是 reactive 类型的时候
// TODO reactive 里面如果有 ref 类型的 key 的话， 那么也是不需要调用 ref .value 的
// （but 这个逻辑在 reactive 里面没有实现）
export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}

// 把 ref 里面的值拿到
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function isRef(value) {
  return !!value.__v_isRef;
}
