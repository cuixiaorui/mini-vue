// 在 render 中使用 proxy 调用 emit 函数
// 也可以直接使用 this
// 验证 proxy 的实现逻辑
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
        onChange(a, b) {
          console.log("---------------change------------------");
          console.log(a, b);
        },
      }),
    ]);
  },
};
