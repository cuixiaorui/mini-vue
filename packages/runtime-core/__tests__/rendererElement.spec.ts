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
