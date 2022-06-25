import { createRenderer } from "../../dist/mini-vue.esm-bundler.js";

// 给基于 pixi.js 的渲染函数
const renderer = createRenderer({
  createElement(type) {
    const rect = new PIXI.Graphics();
    rect.beginFill(0xff0000);
    rect.drawRect(0, 0, 100, 100);
    rect.endFill();

    return rect;
  },

  patchProp(el, key, prevValue, nextValue) {
    el[key] = nextValue;
  },

  insert(el, parent) {
    parent.addChild(el);
  },
});

export function createApp(rootComponent) {
  return renderer.createApp(rootComponent);
}
