import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parser";

describe("parser", () => {
  test("simple text", () => {
    const ast = baseParse("some text");
    const text = ast.children[0];

    expect(text).toStrictEqual({
      type: NodeTypes.TEXT,
      content: "some text",
    });
  });
});
