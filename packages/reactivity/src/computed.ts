import { createDep } from "./dep";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";
import { isFunction } from '@mini-vue/shared'
export class ComputedRefImpl {
  public dep: any;
  public effect: ReactiveEffect;

  private _dirty: boolean;
  private _value
  public readonly readonly
  constructor(getter, private readonly setter, isReadonly) {
    this._dirty = true;
    this.readonly = isReadonly
    this.dep = createDep();
    this.effect = new ReactiveEffect(getter, () => {
      // scheduler
      // 只要触发了这个函数说明响应式对象的值发生改变了
      // 那么就解锁，后续在调用 get 的时候就会重新执行，所以会得到最新的值
      if (this._dirty) return;

      this._dirty = true;
      triggerRefValue(this);
    });
  }

  get value() {
    // 收集依赖
    trackRefValue(this);
    // 锁上，只可以调用一次
    // 当数据改变的时候才会解锁
    // 这里就是缓存实现的核心
    // 解锁是在 scheduler 里面做的
    if (this._dirty) {
      this._dirty = false;
      // 这里执行 run 的话，就是执行用户传入的 fn
      this._value = this.effect.run();
    }

    return this._value;
  }

  set value(newVal) {
    this.setter(newVal)
  }
}

export function computed(getterOrOptions) {
  let getter
  let setter
  const isOnlyGetter = isFunction(getterOrOptions)
  if (isOnlyGetter) {
    getter = getterOrOptions
    setter = () => {
      console.warn('computed value is readonly')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  return new ComputedRefImpl(getter, setter, isOnlyGetter || !setter);
}
