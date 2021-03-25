import { h, ref, reactive } from "../../lib/mini-vue.esm.js";
import Child from "./Child.js";

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", {}, [
      h("div", {}, "你好"),
      h(
        Child,
        {
          msg: "your name is child",
        },
        {
          default: () => h("p", {}, "我是通过 slot 渲染出来的"),
        }
      ),
    ]);
  },
};
