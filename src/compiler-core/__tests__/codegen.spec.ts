import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";
import { transformExpression } from "../src/transforms/transformExpression";

test("interpolation module", () => {
  const ast = baseParse("{{hello}}");
  transform(ast, {
    nodeTransforms: [transformExpression]
  });

  const { code } = generate(ast);
  console.log(code);
});
