import { h, ref, reactive } from "../../../lib/mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, { emit }) {
    emit("change", "aaaaa","bbbbbb");
  },
  render() {
    return h("div", {}, "child");
  },
};
