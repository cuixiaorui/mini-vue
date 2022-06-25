import { h, ref, reactive } from "../../dist/mini-vue.esm-bundler.js";
export default {
  name: "Child",
  setup(props, { emit }) {},
  render(proxy) {
    const self = this
    return h("div", {}, [
      h(
        "button",
        {
          onClick() {
            console.log(proxy);
            console.log("click");
            proxy.$emit("change", "aaa", "bbbb");
            // 使用 this
            console.log(this)
            self.$emit("change", "ccc", "ddd");
          },
        },
        "emit"
      ),
    ]);
  },
};
