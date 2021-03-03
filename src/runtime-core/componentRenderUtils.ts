export function shouldUpdateComponent(prevVNode, nextVNode) {
  const { props: prevProps } = prevVNode;
  const { props: nextProps } = nextVNode;
  //   const emits = component!.emitsOptions;

  // 这里主要是检测组件的 props
  // 核心：只要是 props 发生改变了，那么这个 component 就需要更新

  // 1. props 没有变化，那么不需要更新
  if (prevProps === nextProps) {
    return false;
  }
  // 如果之前没有 props，那么就需要看看现在有没有 props 了
  // 所以这里基于 nextProps 的值来决定是否更新
  if (!prevProps) {
    return !!nextProps;
  }
  // 之前有值，现在没值，那么肯定需要更新
  if (!nextProps) {
    return true;
  }

  // 以上都是比较明显的可以知道 props 是否是变化的
  // 在 hasPropsChanged 会做更细致的对比检测
  return hasPropsChanged(prevProps, nextProps);
}

function hasPropsChanged(prevProps, nextProps): boolean {
  // 依次对比每一个 props.key

  // 提前对比一下 length ，length 不一致肯定是需要更新的
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }

  // 只要现在的 prop 和之前的 prop 不一样那么就需要更新
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
