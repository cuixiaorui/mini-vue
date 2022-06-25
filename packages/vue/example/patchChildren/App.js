import { h } from "../../dist/mini-vue.esm-bundler.js";
import PatchChildren from "./PatchChildren.js";

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [h("p", {}, "主页"), h(PatchChildren)]);
  },
};
