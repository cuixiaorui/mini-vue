import { NodeTypes } from "./ast";
import { helperNameMap, TO_DISPLAY_STRING } from "./runtimeHelpers";

export function generate(ast, options = {}) {
  // 先生成 context
  const context = createCodegenContext(ast, options);
  const { push } = context;

  // 1. 先生成 preambleContext
  genModulePreamble(ast, context);

  const functionName = "render";

  const args = ["_ctx"];

  // _ctx,aaa,bbb,ccc
  // 需要把 args 处理成 上面的 string
  const signature = args.join(", ");
  push(`function ${functionName}(${signature}) {`);
  // 这里需要生成具体的代码内容
  // 开始生成 vnode tree 的表达式
  push("return ");
  genNode(ast.codegenNode, context);

  push("}");

  return {
    code: context.code,
  };
}

function genNode(node: any, context: any) {
  // 生成代码的规则就是读取 node ，然后基于不同的 node 来生成对应的代码块
  // 然后就是把代码快给拼接到一起就可以了

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context);
      break;

    default:
      break;
  }
}

function genExpression(node: any, context: any) {
  context.push(node.content, node);
}

function genInterpolation(node: any, context: any) {
  const { push, helper } = context;
  push(`${helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  push(")");
}

function genModulePreamble(ast, context) {
  // preamble 就是 import 语句
  const { push, newline, runtimeModuleName } = context;

  if (ast.helpers.length) {
    // 比如 ast.helpers 里面有个 [toDisplayString]
    // 那么生成之后就是 import { toDisplayString as _toDisplayString } from "vue"
    const code = `import {${ast.helpers
      .map((s) => `${helperNameMap[s]} as _${helperNameMap[s]}`)
      .join(", ")} } from ${JSON.stringify(runtimeModuleName)}`;

    push(code);
  }

  newline();

  push(`export `);
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
      context.code += "\n";
    },
  };

  return context;
}
