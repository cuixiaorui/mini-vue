import { h, ref, reactive } from "../lib/mini-vue.esm.js";
import PatchChildren from "./components/PatchChildren.js";
import NextTicker from "./components/NextTicker.js";
// import HelloWorld from "./components/HelloWorld.js";
// import { h, ref } from "../../lib/mini-vue.esm.js";

// const count = ref(1);
//  text_children 类型的 update
// const HelloWorld = {
//   name: "HelloWorld",
//   setup() {},
//   render() {
//     return h(
//       "div",
//       { tId: "helloWorld" },
//       `hello world: count: ${count.value}`
//     );
//   },
// };

// props 的 update
// const HiProps = {
//   name:"HiProps",
//   setup(){},
//   render(){
//     return h("div",{id:count.value})
//   }
// }

// let hiPropsInfo = reactive({ id: 1, tId: "ahahah" });
// const HiProps = {
//   name: "HiProps",
//   setup() {},
//   render() {
//     return h("div", { id: hiPropsInfo.id, tId: hiPropsInfo.tId });
//   },
// };

export default {
  name: "App",
  setup() {},

  render() {
    return h("div", { tId: 1 }, [
      h("p", {}, "主页"),
      // h(PatchChildren),
      h(NextTicker),
    ]);
  },
};
