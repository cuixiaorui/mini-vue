import { h, ref } from "../../dist/mini-vue.esm-bundler.js";
import { game } from "./game.js";

export default {
  name: "App",
  setup() {
    // 通过 ticker 来去更新 x 的值

    const x = ref(0);
    const y = ref(0);
    let dir = 1;
    const speed = 2;

    game.ticker.add(() => {
      if (x.value > 400) {
        dir = -1;
      } else if (x.value < 0) {
        dir = 1;
      }

      x.value += speed * dir;
    });

    return {
      x,
      y,
    };
  },

  render() {
    return h("rect", { x: this.x, y: this.y });
  },
};
