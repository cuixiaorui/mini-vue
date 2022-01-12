import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";
import { transformElement } from "../src/transforms/transformElement";
import { transformExpression } from "../src/transforms/transformExpression";

test("interpolation module", () => {
  const ast = baseParse("{{hello}}");
  transform(ast, {
    nodeTransforms: [transformExpression],
  });

  const { code } = generate(ast);
  console.log(code);
});

test("element and interpolation", () => {
  const ast = baseParse("<div>hi,{{msg}}</div>");
  transform(ast, {
    nodeTransforms: [transformExpression, transformElement],
  });

  const { code } = generate(ast);
  console.log(code);
  console.log(code.children[0])
});
