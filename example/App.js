import { h,ref } from "../lib/mini-vue.esm.js";
// import HelloWorld from "./components/HelloWorld.js";
// import { h, ref } from "../../lib/mini-vue.esm.js";

const count = ref(1);
const HelloWorld = {
  name: "HelloWorld",
  setup() {},
  render() {
    return h(
      "div",
      { tId: "helloWorld" },
      `hello world: count: ${count.value}`
    );
  },
};

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "你好，我是p"),
      h(
        "button",
        {
          onclick: () => {
            count.value++;
          },
        },
        "点我啊！"
      ),
      h(HelloWorld),
    ]);
  },
};
