import { NodeTypes } from "./ast";

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}

function createParserContext(content) {
  console.log("创建 paserContext");
  return {
    source: content,
  };
}

function parseChildren(context) {
  console.log("开始解析 children");
  const nodes = [];
  const node = parseText(context);

  nodes.push(node);

  return nodes;
}

function parseText(context): any {
  console.log("解析 text", context);
  const endIndex = context.source.length;
  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context: any, length: number): any {
  console.log("解析 textData");
  // 1. 直接返回 context.source
  // 从 length 切的话，是为了可以获取到 text 的值（需要用一个范围来确定）
  const rawText = context.source.slice(0, length);
  // 2. 移动光标
  advanceBy(context, length);

  return rawText;
}

function advanceBy(context, numberOfCharacters) {
  console.log("推进代码", context, numberOfCharacters);
  context.source = context.source.slice(numberOfCharacters);
}

function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children,
  };
}
