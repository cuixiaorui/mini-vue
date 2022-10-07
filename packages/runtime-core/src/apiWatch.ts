import { ReactiveEffect } from "@mini-vue/reactivity";
import { queuePreFlushCb } from "./scheduler";

// Simple effect.
export function watchEffect(effect) {
  return doWatch(effect);
}

function doWatch(source) {
  // 把 job 添加到 pre flush 里面
  // 也就是在视图更新完成之前进行渲染（待确认？）
  // 当逻辑执行到这里的时候 就已经触发了 watchEffect
  const job = () => {
    effect.run();
  };

  // 当触发 trigger 的时候会调用 scheduler
  // 这里用 scheduler 的目的就是在更新的时候
  // 让回调可以在 render 前执行 变成一个异步的行为（这里也可以通过 flush 来改变）
  const scheduler = () => queuePreFlushCb(job);

  // cleanup 的作用是为了解决初始化的时候不调用 fn(用户传过来的 cleanup)
  // 第一次执行 watchEffect 的时候 onCleanup 会被调用 而这时候只需要把 fn 赋值给 cleanup 就可以
  // 当第二次执行 watchEffect 的时候就需要执行 fn 了 也就是 cleanup  
  let cleanup;
  const onCleanup = (fn) => {
    // 当 effect stop 的时候也需要执行 cleanup 
    // 所以可以在 onStop 中直接执行 fn
    cleanup = effect.onStop = () => {
      fn();
    };
  };
  // 这里是在执行 effect.run 的时候就会调用的
  const getter = () => {
    // 这个的检测就是初始化不执行 cleanup 的关键点
    if (cleanup) {
      cleanup();
    }

    source(onCleanup);
  };

  const effect = new ReactiveEffect(getter, scheduler);

  // 这里执行的就是 getter
  effect.run();

  // 返回值为 StopHandle
  // 只需要调用 stop 即可
  return () => {
    effect.stop();
  };
}
