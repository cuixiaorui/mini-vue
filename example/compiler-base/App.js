// 最简单的情况
// template 只有一个 interpolation
// export default {
//   template: `{{msg}}`,
//   setup() {
//     return {
//       msg: "vue3 - compiler",
//     };
//   },
// };


// 复杂一点
// template 包含 element 和 interpolation 
export default {
  template: `<p>{{msg}}</p>`,
  setup() {
    return {
      msg: "vue3 - compiler",
    };
  },
};
