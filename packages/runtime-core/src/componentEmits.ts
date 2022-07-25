import { camelize, hyphenate, toHandlerKey } from "@mini-vue/shared";
export function emit(instance, event: string, ...rawArgs) {
  // 1. emit 是基于 props 里面的 onXXX 的函数来进行匹配的
  // 所以我们先从 props 中看看是否有对应的 event handler
  const props = instance.props;
  // ex: event -> click 那么这里取的就是 onClick
  // 让事情变的复杂一点如果是烤肉串命名的话，需要转换成  change-page -> changePage
  // 需要得到事件名称
  let handler = props[toHandlerKey(camelize(event))];

  // 如果上面没有匹配的话 那么在检测一下 event 是不是 kebab-case 类型
  if (!handler) {
    handler = props[(toHandlerKey(hyphenate(event)))]
  }


  if (handler) {
    handler(...rawArgs);
  }
}
