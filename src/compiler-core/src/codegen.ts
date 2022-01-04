import { helperNameMap } from "./runtimeHelpers";

export function generate(ast, options = {}) {
  // 先生成 context
  const context = createCodegenContext(ast, options);

  // 1. 先生成 preambleContext
  genModulePreamble(ast, context);

  return {
    code: context.code,
  };
}

function genModulePreamble(ast, context) {
  // preamble 就是 import 语句
  const { push, newline, runtimeModuleName } = context;

  if (ast.helpers.length) {
    // 比如 ast.helpers 里面有个 [toDisplayString]
    // 那么生成之后就是 import { toDisplayString as _toDisplayString } from "vue"
    const code = `import {${ast.helpers
      .map((s) => `${helperNameMap[s]} as _${helperNameMap[s]}`)
      .join(", ")} from ${JSON.stringify(runtimeModuleName)}}`;

    push(code);
  }

  newline();
}

function createCodegenContext(ast: any, { runtimeModuleName = "vue" }): any {
  const context = {
    code: "",
    runtimeModuleName,
    helper(key) {
      return `_${helperNameMap[key]}`;
    },
    push(code) {
      context.code += code;
    },
    newline() {
      // 换新行
      // TODO 需要额外处理缩进
      context.code += "\n" + "    ";
    },
  };

  return context;
}
