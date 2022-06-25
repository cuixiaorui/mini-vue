import { baseParse } from "../src/parse";
import { TO_DISPLAY_STRING } from "../src/runtimeHelpers";
import { transform } from "../src/transform";
describe("Compiler: transform", () => {
  test("context state", () => {
    const ast = baseParse(`<div>hello {{ world }}</div>`);
    console.log(ast);

    // manually store call arguments because context is mutable and shared
    // across calls
    const calls: any[] = [];
    const plugin = (node, context) => {
      calls.push([node, { ...context }]);
    };

    transform(ast, {
      nodeTransforms: [plugin],
    });

    const div = ast.children[0];
    expect(calls.length).toBe(4);
    expect(calls[0]).toMatchObject([
      ast,
      {},
      // TODO
      //       {
      //         parent: null,
      //         currentNode: ast,
      //       },
    ]);
    expect(calls[1]).toMatchObject([
      div,
      {},
      // TODO
      //   {
      //     parent: ast,
      //     currentNode: div,
      //   },
    ]);
    expect(calls[2]).toMatchObject([
      div.children[0],
      {},
      //       {
      //         parent: div,
      //         currentNode: div.children[0],
      //       },
    ]);
    expect(calls[3]).toMatchObject([
      div.children[1],
      {},
      //   {
      //     parent: div,
      //     currentNode: div.children[1],
      //   },
    ]);
  });

  test("should inject toString helper for interpolations", () => {
    const ast = baseParse(`{{ foo }}`);
    transform(ast, {});
    expect(ast.helpers).toContain(TO_DISPLAY_STRING);
  });
});
