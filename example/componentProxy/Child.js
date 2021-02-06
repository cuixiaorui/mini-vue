import { h, ref, reactive } from "../../lib/mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, { emit }) {},
  render(proxy) {
    return h("div", {}, [
      h(
        "button",
        {
          onClick() {
            console.log(proxy);
            console.log("click");
            proxy.$emit("change", "aaa", "bbbb");
          },
        },
        "emit"
      ),
    ]);
  },
};
