// 可以在 setup 中使用 getCurrentInstance 获取组件实例对象
import { h, getCurrentInstance } from "../../dist/mini-vue.esm-bundler.js";

export default {
  name: "App",
  setup() {

    console.log(getCurrentInstance())



    return () => h("div", {}, [h("p", {}, "getCurrentInstance")]);
  },
};
