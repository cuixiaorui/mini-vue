export function createComponentInstance(vnode) {
  const instance = {
    type: vnode.type,
    vnode,
    props: {},
    proxy: null,
  };

  return instance;
}
