import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

test("interpolation module", () => {
  const ast = baseParse("{{hello}}");
  transform(ast);

  const { code } = generate(ast);
  console.log(code);
});
