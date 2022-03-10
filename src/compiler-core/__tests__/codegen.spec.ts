import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";
import { transformElement } from "../src/transforms/transformElement";
import { transformExpression } from "../src/transforms/transformExpression";
import { transformText } from "../src/transforms/transformText";

test("interpolation module", () => {
  const ast = baseParse("{{hello}}");
  transform(ast, {
    nodeTransforms: [transformExpression],
  });

  const { code } = generate(ast);
  expect(code).toMatchSnapshot();
});

test("element and interpolation", () => {
  const ast = baseParse("<div>hi,{{msg}}</div>");
  transform(ast, {
    nodeTransforms: [transformElement, transformText, transformExpression],
  });

  const { code } = generate(ast);
  expect(code).toMatchSnapshot();
});
