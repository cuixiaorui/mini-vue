import { h } from "@mini-vue/runtime-core";
import { nodeOps, render, serialize as inner } from "@mini-vue/runtime-test";

describe("renderer: element", () => {
  let root;

  beforeEach(() => {
    root = nodeOps.createElement("div");
  });

  it("should create an element", () => {
    render(h("div"), root);
    expect(inner(root)).toBe("<div></div>");
  });
});


