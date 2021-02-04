import { h, ref, reactive } from "../../lib/mini-vue.esm.js";
import NextTicker from "./NextTicker.js";

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [h("p", {}, "主页"), h(NextTicker)]);
  },
};
