import { h, ref, reactive } from "../../dist/mini-vue.esm-bundler.js";
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
