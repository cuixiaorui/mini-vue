import { h, ref, reactive } from "../../dist/mini-vue.esm-bundler.js";
import Child from "./Child.js";

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", {}, [
      h("div", {}, "你好"),
      h(Child, {
        msg: "your name is child",
      }),
    ]);
  },
};
