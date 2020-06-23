export function createComponentInstance(vnode) {
  const instance = {
    type: vnode.type,
    vnode,
    props: {},
    proxy: null,
    isMounted: false,
  };

  return instance;
}
