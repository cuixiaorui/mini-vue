import { h, ref } from "../../lib/mini-vue.esm.js";

// 临时模拟使用 refs
// 后面需要支持在 setup 内导出
// 然后在 render 内导入
// 这需要实现 proxy

const count = ref(1);
export default {
  name: "HelloWorld",
  setup() {},
  render() {
    return h("div", { tId: "helloWorld" }, `hello world: count: ${count.value}`);
  },
};
