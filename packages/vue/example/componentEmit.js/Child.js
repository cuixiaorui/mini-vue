import { h, ref, reactive } from "../../dist/mini-vue.esm-bundler.js";
export default {
  name: "Child",
  setup(props, { emit }) {
    emit("change", "aaaaa", "bbbbbb");
    // 支持多个 -
    emit("change-page-name", "start", "game");
  },
  render() {
    return h("div", {}, "child");
  },
};
