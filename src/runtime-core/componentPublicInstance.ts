const publicPropertiesMap = {
  // 当用户调用 instance.proxy.$emit 时就会触发这个函数
  $emit: (i) => i.emit,
};

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 用户访问 proxy[key]
    // 这里就匹配一下看看是否有对应的 function
    // 有的话就直接调用这个 function
    console.log("触发 proxy 的 hook");

    const publicGetter = publicPropertiesMap[key];

    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
