import { h, ref, reactive, renderSlot } from "../../lib/mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, context) {},
  render() {
    return h("div", {}, [
      h("div", {}, "child"),
      // renderSlot 会返回一个 vnode
      // 其本质和 h 是一样的
      renderSlot(this.$slots, "default"),
    ]);
  },
};
