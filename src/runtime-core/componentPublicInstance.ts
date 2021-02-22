const publicPropertiesMap = {
  // 当用户调用 instance.proxy.$emit 时就会触发这个函数
  // i 就是 instance 的缩写 也就是组件实例对象
  $emit: (i) => i.emit,
  $slots: (i) => i.slots,
};

// todo 需要让用户可以直接在 render 函数内直接使用 this 来触发 proxy
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 用户访问 proxy[key]
    // 这里就匹配一下看看是否有对应的 function
    // 有的话就直接调用这个 function
    const { setupState } = instance;
    console.log(`触发 proxy hook , key -> : ${key}`);

    if (key !== "$") {
      // 说明不是访问 public api
      // 先检测访问的 key 是否存在于 setupState 中, 是的话直接返回
      if (key in setupState) {
        return setupState[key];
      }
    }

    const publicGetter = publicPropertiesMap[key];

    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
