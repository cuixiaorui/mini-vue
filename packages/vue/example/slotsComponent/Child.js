import { h, ref, reactive, renderSlot } from "../../dist/mini-vue.esm-bundler.js";
export default {
  name: "Child",
  setup(props, context) {},
  render() {
    return h("div", {}, [
      h("div", {}, "child"),
      // renderSlot 会返回一个 vnode
      // 其本质和 h 是一样的
      // 第三个参数给出数据
      renderSlot(this.$slots, "default", {
        age: 16,
      }),
    ]);
  },
};
