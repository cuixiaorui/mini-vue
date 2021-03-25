import { h, ref, reactive } from "../../lib/mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, context) {
    console.log("props------------------>", props);
    console.log("context---------------->", context);
  },
  render() {
    return h("div", {}, "child");
  },
};
