import { h } from "../lib/mini-vue.esm.js";
import HelloWorld from "./components/HelloWorld.js";

export default {
    name:"App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [h("p", {}, "你好，我是p"), h(HelloWorld)]);
  },
};
