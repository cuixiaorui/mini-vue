// 在 render 中可以通过 this.xxx 访问到 setup 返回的对象
import { h, ref, reactive } from "../../dist/mini-vue.esm-bundler.js";

export default {
  name: "App",
  setup() {
    const count = ref(0);
    const handleClick = () => {
      console.log("click");
      count.value++;
    };

    return {
      count,
      handleClick,
    };
  },

  render() {
    console.log(this.count);
    return h("div", {}, [
      h("div", {}, String(this.count)),
      h("button", { onClick: this.handleClick }, "click"),
    ]);
  },
};
