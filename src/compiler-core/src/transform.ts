import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
  // 1. 创建 context

  const context = createTransformContext(root, options);

  // 2. 遍历 node
  traverseNode(root, context);

  root.helpers.push(...context.helpers.keys());
}

function traverseNode(node: any, context) {
  const type: NodeTypes = node.type;

  // 遍历调用所有的 nodeTransforms
  // 把 node 给到 transform
  // 用户可以对 node 做处理
  const nodeTransforms = context.nodeTransforms;

  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    // TODO transform 可以返回一个函数， 作为 exit 的时候调用
    transform(node, context);
  }

  switch (type) {
    case NodeTypes.INTERPOLATION:
      // 插值的点，在于后续生成 render 代码的时候是获取变量的值
      context.helper(TO_DISPLAY_STRING);
      break;

    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;

    default:
      break;
  }
}

function traverseChildren(parent: any, context: any) {
  // node.children
  parent.children.forEach((node) => {
    // TODO 需要设置 context 的值
    traverseNode(node, context);
  });
}

function createTransformContext(root, options): any {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(name) {
      // 这里会收集调用的次数
      // TODO 但是为什么收集次数呢？
      // helpers 数据会在后续生成代码的时候用到
      const count = context.helpers.get(name) || 0;
      context.helpers.set(name, count + 1);
    },
  };

  return context;
}
