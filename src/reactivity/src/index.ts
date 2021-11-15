export {
  reactive,
  readonly,
  shallowReadonly,
  isReadonly,
  isReactive,
  isProxy,
} from "./reactive";

export { ref, proxyRefs, unRef, isRef } from "./ref";

export { effect, stop } from "./effect";

export { computed } from "./computed";

// toRef：：： 可以用来为源响应式对象上的某个 property 新创建一个 ref。然后，ref 可以被传递，它会保持对其源 property 的响应式连接。

// example：：：
// const state = reactive({
//   foo: 1,
//   bar: 2
// })
// const fooRef = toRef(state, 'foo')
// fooRef.value++
// console.log(state.foo) // 2
// state.foo++
// console.log(fooRef.value) // 3

// export function toRef<T extends object, K extends keyof T>(
//   object: T,
//   key: K
// ): ToRef<T[K]> {
//   const val = object[key]; //获取对象属性的值
//   return isRef(val) ? val : (new ObjectRefImpl(object, key) as any); //new ObjectRefImpl(object, key)
// }

// toRefs; 将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 ref。

// example：：：
// const state = reactive({
//   foo: 1,
//   bar: 2
// })
// const stateAsRefs = toRefs(state)
// ref 和原始 property 已经“链接”起来了
// state.foo++
// console.log(stateAsRefs.foo.value) // 2
// stateAsRefs.foo.value++
// console.log(state.foo) // 3

// export function toRefs<T extends object>(object: T): ToRefs<T> {
//   if (__DEV__ && !isProxy(object)) {
//     console.warn(
//       `toRefs() expects a reactive object but received a plain one.`
//     );
//   }
//   const ret: any = isArray(object) ? new Array(object.length) : {};
//   for (const key in object) {
//     ret[key] = toRef(object, key);
//   }
//   return ret;
// }

// watchEffect::::

// example::::
// const count = ref({ count: 11 });
// watchEffect(() => console.log(count.value));
// setTimeout(() => {
//   count.value.count++;
// }, 100);

// watchEffect 会返回一个用于停止这个监听的函数

// const stopHandle = watchEffect(() => {
//   /* ... */
// });
// stopHandle();

// 停止调用内部函数：：：：
// watchEffect((onInvalidate) => {
//   const token = asyncOperation(id.value);

//   onInvalidate(() => {
//     // run if id has changed or watcher is stopped
//     token.cancel();
//   });
// });

// Simple effect.
// export function watchEffect(
//   effect: WatchEffect,
//   options?: WatchOptionsBase  //{ immediate, deep, flush, onTrack, onTrigger } flush?: 'pre' | 'post' | 'sync';  onTrack, onTrigger
// ): WatchStopHandle {
//   return doWatch(effect, null, options);
// }
