import { h, ref, reactive, createTextVNode } from "../../lib/mini-vue.esm.js";

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", {}, [
      h("div", {}, "你好"),
      createTextVNode("这是通过 createTextVNode 创建的节点"),
    ]);
  },
};
