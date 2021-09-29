import { baseParse } from "../src/parse";
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
});
