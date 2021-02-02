export function emit(instance, event: string, ...rawArgs) {
  // 1. emit 是基于 props 里面的 onXXX 的函数来进行匹配的
  // 所以我们先从 props 中看看是否有对应的 event handler
  const props = instance.props;
  // ex: event -> click 那么这里取的就是 onClick
  // 需要得到事件名称
  const handlerName = "on" + event.charAt(0).toUpperCase() + event.slice(1);
  const handler = props[handlerName];
  if (handler) {
    handler(...rawArgs);
  }
}
