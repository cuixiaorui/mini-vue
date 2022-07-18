import { h } from "@mini-vue/runtime-dom";
import { nodeOps, render, serializeInner } from "@mini-vue/runtime-test";

describe("renderer: component", () => {
  it("should create an Component ", () => {
    const Comp = {
      render: () => {
        return h("div");
      },
    };
    const root = nodeOps.createElement("div");
    render(h(Comp), root);
    expect(serializeInner(root)).toBe(`<div></div>`);
  });

  it("should create an Component with direct text children", () => {
    const Comp = {
      render: () => {
        return h("div", null, "test");
      },
    };
    const root = nodeOps.createElement("div");
    render(h(Comp), root);
    expect(serializeInner(root)).toBe(`<div>test</div>`);
  });
});
