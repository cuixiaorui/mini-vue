import { h, ref, reactive } from "../../lib/mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, { emit }) {},
  render(proxy) {
    const self = this;
    return h("div", {}, [h("div", {}, "child")]);
  },
};
