import { h } from "../../lib/mini-vue.esm.js";
import { ref } from "../../lib/mini-vue.esm.js";

const isChange = ref(false);
// 默认是顺序不变，新旧节点的数量不变，属性不变
// 第一种情况：（从前往后依次对比）
// 属性变了
// const prevChildren = [h("div", { key: "a", id: "old-a" }, "a")];
// const nextChildren = [h("div", { key: "a", id: "new-a" }, "a")];

//第二种情况：
// 新节点的数量增加了一个
// const prevChildren = [h("div", { key: "a", id: "old-a" }, "a")];
// const nextChildren = [
//   h("div", { key: "a", id: "new-a" }, "a"),
//   h("div", { key: "b" }, "b"),
// ];

// 新节点数量增加两个
// const prevChildren = [h("div", { key: "a", id: "old-a" }, "a")];
// const nextChildren = [
//   h("div", { key: "a", id: "new-a" }, "a"),
//   h("div", { key: "b" }, "b"),
//   h("div", { key: "c" }, "c"),
// ];

// 第三种情况：
// 新节点的数量减少了一个
// const prevChildren = [
//   h("div", { key: "a" }, "a"),
//   h("div", { key: "b" }, "b"),
//   h("div", { key: "c" }, "c"),
// ];

// const nextChildren = [h("div", { key: "a" }, "a"), h("div", { key: "b" }, "b")];

// 新节点的数量减少了两个
// const prevChildren = [
//   h("div", { key: "a" }, "a"),
//   h("div", { key: "b" }, "b"),
//   h("div", { key: "c" }, "c"),
// ];

// const nextChildren = [h("div", { key: "a" }, "a")];

// 第四种情况：(从后往前依次对比)
// a (b)
// (b)
// const prevChildren = [
//   h("div", { key: "a" }, "a"),
//   h("div", { key: "b", id: "old-id" }, "b"),
// ];
// const nextChildren = [h("div", { key: "b", id: "new-id" }, "b")];

// 第五种情况
// 顺序变了,但是新老节点都存在
// 先只验证节点的 props 是否正常更新
// todo: 还需要移动位置
// a,b
// b,a
// const prevChildren = [
//   h("div", { key: "a", id: "old-a" }, "a"),
//   h("div", { key: "b", id: "old-b" }, "b"),
// ];
// const nextChildren = [
//   h("div", { key: "b", id: "new-b" }, "b"),
//   h("div", { key: "a", id: "new-a" }, "a"),
// ];

// 第六种情况
// 顺序变了，老节点在 newChildren 里面不存在
// 还需要处理一下位置的移动
// a,b,c
// b,a
// const prevChildren = [
//   h("div", { key: "a", id: "old-a" }, "a"),
//   h("div", { key: "b", id: "old-b" }, "b"),
//   h("div", { key: "c", id: "old-c" }, "c"),
// ];
// const nextChildren = [
//   h("div", { key: "b", id: "new-b" }, "b"),
//   h("div", { key: "a", id: "new-a" }, "a"),
// ];

// 第七种情况
// 顺序变了，新节点在 oldChildren 里面不存在
// 需要创建新节点
// 还需要移动元素位置（ anchor 有值的情况下 ）
// const prevChildren = [
//   h("div", { key: "a", id: "old-a" }, "a"),
//   h("div", { key: "b", id: "old-b" }, "b"),
// ];
// const nextChildren = [
//   h("div", { key: "b", id: "new-b" }, "b"),
//   h("div", { key: "a", id: "new-a" }, "a"),
//   h("div", { key: "c", id: "new-c" }, "c"),
// ];


// 第八种情况
// 移动元素位置（ anchor 没有值的情况下 ）
// 要移动的元素是属于最后一个位置
const prevChildren = [
  h("div", { key: "a", id: "old-a" }, "a"),
  h("div", { key: "b", id: "old-b" }, "b"),
];
const nextChildren = [
  h("div", { key: "b", id: "old-b" }, "b"),
  h("div", { key: "a", id: "old-a" }, "a"),
];

        

export default {
  name: "PatchChildren",
  setup() {},
  render() {
    return h("div", {}, [
      h(
        "button",
        {
          onclick: () => {
            isChange.value = !isChange.value;
          },
        },
        "测试子组件之间的 patch 逻辑"
      ),
      h("children", {}, isChange.value === true ? nextChildren : prevChildren),
    ]);
  },
};
