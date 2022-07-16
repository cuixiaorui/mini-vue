import { h } from "@mini-vue/runtime-core";
import { nodeOps, render, serializeInner as inner } from "@mini-vue/runtime-test";

describe("renderer: element", () => {
  let root;

  beforeEach(() => {
    root = nodeOps.createElement("div");
  });

  it("should create an element", () => {
    render(h("div"), root);
    expect(inner(root)).toBe("<div></div>");
  });

  it('should create an element with props', () => {
    render(h('div', { id: 'foo', class: 'bar' },[]), root)
    expect(inner(root)).toBe('<div id="foo" class="bar"></div>')
  })
  it('should create an element with direct text children and props', () => {
    render(h('div', { id: 'foo' }, "bar"), root)
    expect(inner(root)).toBe('<div id="foo">bar</div>')
  })
});


