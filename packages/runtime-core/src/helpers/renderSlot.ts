import { createVNode, Fragment } from "../vnode";

/**
 * Compiler runtime helper for rendering `<slot/>`
 * 用来 render slot 的
 * 之前是把 slot 的数据都存在 instance.slots 内(可以看 componentSlot.ts)，
 * 这里就是取数据然后渲染出来的点
 * 这个是由 compiler 模块直接渲染出来的 -可以参看这个 demo https://vue-next-template-explorer.netlify.app/#%7B%22src%22%3A%22%3Cdiv%3E%5Cn%20%20%3Cslot%3E%3C%2Fslot%3E%5Cn%3C%2Fdiv%3E%22%2C%22ssr%22%3Afalse%2C%22options%22%3A%7B%22mode%22%3A%22module%22%2C%22prefixIdentifiers%22%3Afalse%2C%22optimizeImports%22%3Afalse%2C%22hoistStatic%22%3Afalse%2C%22cacheHandlers%22%3Afalse%2C%22scopeId%22%3Anull%2C%22inline%22%3Afalse%2C%22ssrCssVars%22%3A%22%7B%20color%20%7D%22%2C%22bindingMetadata%22%3A%7B%22TestComponent%22%3A%22setup-const%22%2C%22setupRef%22%3A%22setup-ref%22%2C%22setupConst%22%3A%22setup-const%22%2C%22setupLet%22%3A%22setup-let%22%2C%22setupMaybeRef%22%3A%22setup-maybe-ref%22%2C%22setupProp%22%3A%22props%22%2C%22vMySetupDir%22%3A%22setup-const%22%7D%2C%22optimizeBindings%22%3Afalse%7D%7D
 * 其最终目的就是在 render 函数中调用 renderSlot 取 instance.slots 内的数据
 * TODO 这里应该是一个返回一个 block ,但是暂时还没有支持 block ，所以这个暂时只需要返回一个 vnode 即可
 * 因为 block 的本质就是返回一个 vnode
 *
 * @private
 */
export function renderSlot(slots, name: string, props = {}) {
  const slot = slots[name];
  console.log(`渲染插槽 slot -> ${name}`);
  if (slot) {
    // 因为 slot 是一个返回 vnode 的函数，我们只需要把这个结果返回出去即可
    // slot 就是一个函数，所以就可以把当前组件的一些数据给传出去，这个就是作用域插槽
    // 参数就是 props
    const slotContent = slot(props);
    return createVNode(Fragment, {}, slotContent);
  }
}
